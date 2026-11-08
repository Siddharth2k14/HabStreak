import type { ConfirmChannel, ConsumeMessage } from "amqplib";
import prisma from "../config/prisma.ts";
import { createConfirmChannel, closeRabbitMQ } from "../config/rabbitmq.connection.ts";
import { EXCHANGES } from "../messaging/exchanges.ts";
import { initializeQueues, QUEUES, ROUTING_KEYS } from "../messaging/queues.ts";
import type { enqueueVerificationEmail } from "../queues/email.queue.ts";
import { sendVerificationEmail } from "../services/email.service.ts";
import { generateVerificationToken, hashVerificationToken } from "../utils/token.utils.ts";

const MAX_RETRIES = 3;

let channel: ConfirmChannel | null = null;
let consumerTag: string | null = null;
let shuttingDown = false;
const activeTasks = new Set<Promise<void>>();

const parseMessage = (message: ConsumeMessage): enqueueVerificationEmail => {
    const payload: unknown = JSON.parse(message.content.toString("utf-8"));

    if (typeof payload !== "object" || payload === null || !("outboxEventId" in payload) || !("userId" in payload) || typeof payload.outboxEventId !== "string" || typeof payload.userId !== "string" || !payload.outboxEventId || !payload.userId) {
        throw new Error("Invalid verification email message");
    }

    return payload as enqueueVerificationEmail;
};

const getRetryCount = (message: ConsumeMessage): number => {
    const retryCount = message.properties.headers?.["x-retry-count"];

    if (typeof retryCount === "number" && Number.isInteger(retryCount) && retryCount >= 0) {
        return retryCount;
    }

    return 0;
};

const processVerificationEmail = async (job: enqueueVerificationEmail): Promise<void> => {
    const { userId } = job;

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            email: true,
            username: true,
            isActive: true,
            isVerified: true,
        },
    });

    if (!user) {
        throw new Error(`User ${userId} was not found.`);
    }

    if (user.isVerified) {
        console.log(`User ${userId} is already verified. Skipping email`);
        return;
    }

    if (!user.isActive) {
        console.log(`User ${userId} is inactive. Skipping email`);
        return;
    }

    const token = generateVerificationToken();
    const hashedToken = hashVerificationToken(token);

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            verificationToken: hashedToken,
            verificationExpires: expiresAt,
        },
    });

    await sendVerificationEmail({
        email: user.email,
        name: user.username,
        token,
    });

    console.log(`Verification email sent for user ${userId}`);
};

/**
 * Publish a retry message and wait for RabbitMQ confirmation.
 *
 * The original delivery must not be acknowledged until the
 * retry message has been confirmed by RabbitMQ.
 */
const publishRetry = async (
    currentChannel: ConfirmChannel,
    message: ConsumeMessage,
    retryCount: number,
    job: enqueueVerificationEmail
): Promise<void> => {
    const messageId = message.properties.messageId;
    if (!messageId) {
        throw new Error("Cannot retry message without a messageId.");
    }

    const payload = Buffer.from(
        JSON.stringify(job),
        "utf-8"
    );

    await new Promise<void>((resolve, reject) => {
        let returned = false;

        const handleReturn = (
            returnedMessage: ConsumeMessage
        ) => {
            if (
                returnedMessage.properties.messageId === messageId
            ) {
                returned = true;
            }
        };

        const cleanup = () => {
            currentChannel.removeListener(
                "return",
                handleReturn
            );
        };

        currentChannel.on("return", handleReturn);

        try {
            currentChannel.publish(
                EXCHANGES.EVENTS,
                ROUTING_KEYS.EMAIL_VERIFICATION_RETRY,
                payload,
                {
                    persistent: true,
                    mandatory: true,
                    contentType: "application/json",
                    contentEncoding: "utf-8",
                    messageId,
                    type: "AUTH_VERIFICATION_EMAIL_REQUESTED",
                    headers: {
                        ...message.properties.headers,
                        "x-retry-count": retryCount + 1,
                    },
                },
                (error) => {
                    cleanup();

                    if (error) {
                        reject(error);
                        return;
                    }

                    if (returned) {
                        reject(
                            new Error(
                                "Retry message could not be routed."
                            )
                        );
                        return;
                    }

                    resolve();
                }
            );
        } catch (error) {
            cleanup();
            reject(error);
        }
    });
};

/**
 * Handle one RabbitMQ delivery.
 */
const handleMessage = async (
    currentChannel: ConfirmChannel,
    message: ConsumeMessage
): Promise<void> => {
    let job: enqueueVerificationEmail | null = null;

    try {
        job = parseMessage(message);

        await processVerificationEmail(job);

        // ACK only after successful processing.
        currentChannel.ack(message);

    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : String(error);

        console.error("Verification email processing failed:", {
            messageId: message.properties.messageId,
            error: errorMessage,
        });

        if (!job) {
            // Invalid JSON or invalid payload: send directly to DLQ.
            currentChannel.nack(message, false, false);
            return;
        }

        const retryCount = getRetryCount(message);

        if (retryCount < MAX_RETRIES) {
            try {
                await publishRetry(
                    currentChannel,
                    message,
                    retryCount,
                    job
                );

                // A retry copy is safely confirmed in RabbitMQ.
                currentChannel.ack(message);

                console.log(
                    `Retry ${retryCount + 1}/${MAX_RETRIES} scheduled for user ${job.userId}.`
                );

            } catch (retryError) {
                console.error(
                    "Failed to publish retry message:",
                    retryError
                );

                // Retry publication failed. Keep the original
                // message available for redelivery.
                currentChannel.nack(message, false, true);
            }

            return;
        }

        console.error(
            `Maximum retries exhausted for user ${job.userId}. Sending to DLQ.`
        );

        // Main queue's dead-letter exchange handles this.
        currentChannel.nack(message, false, false);
    }
};

/**
 * Start RabbitMQ email consumer.
 */
export const startEmailWorker = async (): Promise<void> => {
    channel = await createConfirmChannel();

    await initializeQueues(channel);

    await channel.prefetch(5);

    const result = await channel.consume(
        QUEUES.EMAIL_VERIFICATION,
        (message) => {
            if (!message || !channel || shuttingDown) {
                return;
            }

            const task = handleMessage(channel, message)
                .catch((error) => {
                    console.error("Unexpected email worker error:", error);
                })
                .finally(() => {
                    activeTasks.delete(task);
                });

            activeTasks.add(task);
        }
    );

    consumerTag = result.consumerTag;

    console.log(
        "RabbitMQ email worker connected and ready."
    );
};

/**
 * Graceful shutdown.
 */
const shutdown = async (): Promise<void> => {
    if (shuttingDown) return;

    shuttingDown = true;

    console.log("Shutting down email worker...");

    try {
        if (channel && consumerTag) {
            await channel.cancel(consumerTag);
        }

        // Wait for already-delivered messages to finish.
        await Promise.allSettled([...activeTasks]);

        if (channel) {
            await channel.close();
            channel = null;
        }

        await closeRabbitMQ();
        await prisma.$disconnect();

        console.log("Email worker stopped gracefully.");
    } catch (error) {
        console.error("Email worker shutdown error:", error);
        process.exitCode = 1;
    }
};

process.once("SIGINT", () => {
    void shutdown();
});

process.once("SIGTERM", () => {
    void shutdown();
});

startEmailWorker().catch(async (error) => {
    console.error("Failed to start email worker:", error);

    await shutdown();

    process.exitCode = 1;
});
