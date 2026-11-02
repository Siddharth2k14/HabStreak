import type { Channel } from "amqplib";
import { EXCHANGES } from "./exchanges.ts";

export const QUEUES = {
    EMAIL_VERIFICATION: "email.verification",
    EMAIL_VERIFICATION_RETRY: "email.verification.retry",
    EMAIL_VERIFICATION_DLQ: "email.verification.dlq",
} as const;

export const ROUTING_KEYS = {
    EMAIL_VERIFICATION_REQUESTED:
        "auth.email.verification.requested",
    EMAIL_VERIFICATION_RETRY:
        "auth.email.verification.retry",
    EMAIL_VERIFICATION_DEAD:
        "email.verification.dead",
} as const;

export const initializeQueues = async (
    channel: Channel
): Promise<void> => {
    // Final destination for messages that exhaust retries.
    await channel.assertQueue(
        QUEUES.EMAIL_VERIFICATION_DLQ,
        { durable: true }
    );

    // Retry queue: messages wait here for 5 seconds,
    // then RabbitMQ routes them back to the main exchange.
    await channel.assertQueue(
        QUEUES.EMAIL_VERIFICATION_RETRY,
        {
            durable: true,
            arguments: {
                "x-message-ttl": 5000,
                "x-dead-letter-exchange": EXCHANGES.EVENTS,
                "x-dead-letter-routing-key":
                    ROUTING_KEYS.EMAIL_VERIFICATION_REQUESTED,
            },
        }
    );

    // Main email queue.
    await channel.assertQueue(
        QUEUES.EMAIL_VERIFICATION,
        {
            durable: true,
            arguments: {
                "x-dead-letter-exchange": EXCHANGES.DEAD_LETTER,
                "x-dead-letter-routing-key":
                    ROUTING_KEYS.EMAIL_VERIFICATION_DEAD,
            },
        }
    );

    await channel.bindQueue(
        QUEUES.EMAIL_VERIFICATION,
        EXCHANGES.EVENTS,
        ROUTING_KEYS.EMAIL_VERIFICATION_REQUESTED
    );

    await channel.bindQueue(
        QUEUES.EMAIL_VERIFICATION_RETRY,
        EXCHANGES.EVENTS,
        ROUTING_KEYS.EMAIL_VERIFICATION_RETRY
    );

    await channel.bindQueue(
        QUEUES.EMAIL_VERIFICATION_DLQ,
        EXCHANGES.DEAD_LETTER,
        ROUTING_KEYS.EMAIL_VERIFICATION_DEAD
    );

    console.log("RabbitMQ queues initialized.");
};
