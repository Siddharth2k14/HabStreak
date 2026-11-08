import prisma from "../config/prisma.ts";

import {
    createConfirmChannel,
    closeRabbitMQ,
} from "../config/rabbitmq.connection.ts";

import {
    publishMessage,
} from "../messaging/rabbitmq.publisher.ts";

import {
    ROUTING_KEYS,
} from "../messaging/queues.ts";

const BATCH_SIZE = 5;
const MAX_ATTEMPTS = 5;

const POLL_INTERVAL = 2000;
const LEASE_DURATION_MS = 5 * 60 * 1000;

interface ClaimedOutboxEvent {
    id: string;
    eventType: string;
    payload: unknown;
    attempts: number;
    lockedAt: Date;
}

const getRetryDelay = (attempts: number): number => {
    return Math.min(
        60_000,
        2 ** attempts * 1000
    );
};

const claimOutboxEvents = async (): Promise<ClaimedOutboxEvent[]> => {
    const now = new Date();
    const staleBefore = new Date(now.getTime() - LEASE_DURATION_MS);

    return prisma.$transaction(async (tx) => {
        // Recover stale events that have exhausted their attempts.
        await tx.outboxEvent.updateMany({
            where: {
                status: "PROCESSING",
                lockedAt: {
                    lt: staleBefore,
                },
                attempts: {
                    gte: MAX_ATTEMPTS - 1,
                },
            },
            data: {
                status: "FAILED",
                lockedAt: null,
                attempts: {
                    increment: 1,
                },
                lastError: "Processing lease expired. Maximum attempts exhausted.",
            }
        })

        // Recover stale events that can still be retrived.
        await tx.outboxEvent.updateMany({
            where: {
                status: "PROCESSING",
                lockedAt: {
                    lt: staleBefore,
                },
                attempts: {
                    gte: MAX_ATTEMPTS - 1,
                },
            },
            data: {
                status: "PENDING",
                lockedAt: null,
                attempts: {
                    increment: 1,
                },
                availableAt: now,
                lastError: "Recovered stale processing event.",
            },
        });

        // Atomically select and lock available rows.
        const events = await tx.$queryRaw<ClaimedOutboxEvent[]>`
            SELECT
                id,
                "eventType",
                payload,
                attempts
            FROM outbox_events
            WHERE status = 'PENDING'
              AND "availableAt" <= ${now}
              AND attempts < ${MAX_ATTEMPTS}
            ORDER BY "createdAt" ASC
            LIMIT ${BATCH_SIZE}
            FOR UPDATE SKIP LOCKED
        `;

        if (events.length === 0) {
            return [];
        }

        const ids = events.map((event) => event.id);

        // Claim all selected events before committing the transaction.
        await tx.outboxEvent.updateMany({
            where: {
                id: {
                    in: ids,
                },
                status: "PENDING",
            },
            data: {
                status: "PROCESSING",
                lockedAt: now,
            },
        });

        return events.map((event) => ({
            ...event,
            lockedAt: now,
        }));
    });
};

const markPublished = async (
    eventId: string,
    lockedAt: Date
): Promise<void> => {
    const result = await prisma.outboxEvent.updateMany({
        where: {
            id: eventId,
            status: "PROCESSING",
            lockedAt,
        },
        data: {
            status: "PUBLISHED",
            publishedAt: new Date(),
            lockedAt: null,
            lastError: null,
        },
    });

    if (result.count !== 1) {
        throw new Error(
            `Could not finalize outbox event ${eventId}: claim was lost.`
        );
    }
};

const markFailed = async (
    event: ClaimedOutboxEvent,
    lockedAt: Date,
    error: unknown
): Promise<void> => {
    const message =
        error instanceof Error ? error.message : String(error);

    const attempts = event.attempts + 1;
    const terminal = attempts >= MAX_ATTEMPTS;

    const result = await prisma.outboxEvent.updateMany({
        where: {
            id: event.id,
            status: "PROCESSING",
            lockedAt,
        },
        data: {
            attempts,
            status: terminal ? "FAILED" : "PENDING",
            availableAt: new Date(
                Date.now() + getRetryDelay(attempts)
            ),
            lockedAt: null,
            lastError: message.slice(0, 2000),
        },
    });

    if (result.count !== 1) {
        console.error(
            `Could not update failed outbox event ${event.id}: claim was lost.`
        );
    }
};

export const publishOutboxEvents = async (): Promise<void> => {
    const events = await claimOutboxEvents();

    if (events.length === 0) {
        return;
    }

    const channel = await createConfirmChannel();

    try {
        for (const event of events) {
            // Use the claim timestamp to ensure this publisher still owns
            // the event. It is the same timestamp used in claimOutboxEvents.
            // See the note below: this must be returned with each claimed row.
            try {
                if (
                    event.eventType !==
                    "AUTH_VERIFICATION_EMAIL_REQUESTED"
                ) {
                    throw new Error(
                        `Unsupported outbox event: ${event.eventType}`
                    );
                }

                const payload: unknown = event.payload;

                if (
                    typeof payload !== "object" ||
                    payload === null ||
                    Array.isArray(payload) ||
                    !("userId" in payload) ||
                    typeof payload.userId !== "string" ||
                    !payload.userId
                ) {
                    throw new Error(
                        `Invalid payload for outbox event ${event.id}`
                    );
                }

                await publishMessage(
                    channel,
                    ROUTING_KEYS.EMAIL_VERIFICATION_REQUESTED,
                    {
                        outboxEventId: event.id,
                        userId: payload.userId,
                    },
                    {
                        messageId: event.id,
                        eventType: event.eventType,
                    }
                );

                // Only update after RabbitMQ confirms and routing succeeds.
                await markPublished(
                    event.id,
                    event.lockedAt,
                );

                console.log(
                    `Outbox event ${event.id} published successfully.`
                );
            } catch (error) {
                await markFailed(
                    event,
                    event.lockedAt,
                    error
                );

                console.error(
                    `Outbox event ${event.id} failed:`,
                    error
                );
            }
        }
    } finally {
        await channel.close();
    }
};

const run = async (): Promise<void> => {
    console.log("RabbitMQ outbox publisher started.");

    while (true) {
        try {
            await publishOutboxEvents();
        } catch (error) {
            console.error("Outbox publisher error:", error);
        }

        await new Promise((resolve) =>
            setTimeout(resolve, POLL_INTERVAL)
        );
    }
};

run().catch(async (error) => {
    console.error("Outbox publisher stopped:", error);

    await closeRabbitMQ();

    process.exitCode = 1;
});