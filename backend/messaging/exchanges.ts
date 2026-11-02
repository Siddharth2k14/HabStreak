import type { Channel } from "amqplib";

export const EXCHANGES = {
    EVENTS: "habstreak.events",
    DEAD_LETTER: "habstreak.dead-letter",
} as const;

export const initializeExchanges = async (
    channel: Channel
): Promise<void> => {
    await channel.assertExchange(
        EXCHANGES.EVENTS,
        "direct",
        { durable: true }
    );

    await channel.assertExchange(
        EXCHANGES.DEAD_LETTER,
        "direct",
        { durable: true }
    );

    console.log("RabbitMQ exchanges initialized.");
};