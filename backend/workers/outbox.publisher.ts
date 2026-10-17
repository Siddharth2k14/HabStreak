import prisma from "../config/prisma.ts";
import { enqueueVerificationEmail } from "../queues/email.queue.ts";

const BATCH_SIZE = 20;
const MAX_ATTEMPTS = 5;

export const publishOutboxEvents = async (): Promise<void> => {

    // Recover events claimed by a publisher that stopped unexpectedly.
    // Use a lease longer than normal queue-publishing operations.
    const staleBefore = new Date(Date.now() - 2 * 60 * 1000);

    await prisma.outboxEvent.updateMany({
        where: {
            status: "PROCESSING",
            lockedAt: {
                lt: staleBefore,
            },
        },
        data: {
            status: "PENDING",
            lockedAt: null,
            availableAt: new Date(),
            lastError: "Recovered stale processing event.",
        },
    });
    const events = await prisma.outboxEvent.findMany({
        where: {
            status: 'PENDING',
            availableAt: { lte: new Date() },
        },
        orderBy: {
            createdAt: "asc"
        },
        take: BATCH_SIZE,
    });

    for (const event of events) {
        const claim = await prisma.outboxEvent.updateMany({
            where: {
                id: event.id,
                status: "PENDING",
            },
            data: {
                status: "PROCESSING",
                lockedAt: new Date(),
            },
        });

        if (claim.count === 0) {
            continue;
        }

        try {
            if (event.eventType !== "AUTH_VERIFICATION_EMAIL_REQUESTED") {
                throw new Error(`Unsupported outbox event: ${event.eventType}`);
            }

            const payload = event.payload as { userId?: unknown };

            if (typeof payload.userId !== "string") {
                throw new Error(
                    `Invalid payload for outbox event ${event.id}`,
                );
            }

            await enqueueVerificationEmail({
                outboxEventId: event.id,
                userId: payload.userId,
            });

            await prisma.outboxEvent.update({
                where: {
                    id: event.id
                },
                data: {
                    status: "PUBLISHED",
                    publishedAt: new Date(),
                    lockedAt: null,
                    lastError: null,
                },
            });
        } catch (error) {
            const attempts = event.attempts + 1;
            const message = error instanceof Error ? error.message : String(error);

            await prisma.outboxEvent.update({
                where: { id: event.id },
                data: {
                    attempts,
                    status: attempts >= MAX_ATTEMPTS ? "FAILED" : "PENDING",
                    availableAt: new Date(Date.now() + Math.min(60_000, 2 ** attempts * 1000)),
                    lockedAt: null,
                    lastError: message.slice(0, 2000),
                },
            });

            console.error(`Outbox event ${event.id} failed:`, message);
        }
    }
};

const run = async () => {
    console.log("Outbox publisher started");

    while (true) {
        try {
            await publishOutboxEvents();
        } catch (error) {
            console.error("Outbox publisher error:", error);
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
};

run().catch((error) => {
    console.error("Outbox publisher stopped:", error);
    process.exitCode = 1;
});