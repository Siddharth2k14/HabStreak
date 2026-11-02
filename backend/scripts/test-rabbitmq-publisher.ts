import {
    createConfirmChannel,
    closeRabbitMQ,
} from "../config/rabbitmq.connection.ts";

import {
    initializeExchanges,
} from "../messaging/exchanges.ts";

import {
    initializeQueues,
    ROUTING_KEYS,
} from "../messaging/queues.ts";

import {
    publishMessage,
} from "../messaging/rabbitmq.publisher.ts";

import { randomUUID } from "node:crypto";

const testPublisher = async () => {

    let channel;

    try {

        channel = await createConfirmChannel();

        // Ensure topology exists before publishing.
        await initializeExchanges(channel);

        await initializeQueues(channel);

        const message = {
            userId: "test-user-123",
        };

        const messageId = await publishMessage(
            channel,
            ROUTING_KEYS.EMAIL_VERIFICATION_REQUESTED,
            message,
            {
                messageId: randomUUID(),
                eventType: "AUTH_VERIFICATION_EMAIL_REQUESTED",
            }
        );

        console.log("Message published successfully!");
        console.log("Message ID:", messageId);

    } catch (error) {

        console.error("Publisher test failed:", error);

        process.exitCode = 1;

    } finally {

        if (channel) {
            await channel.close();
        }

        await closeRabbitMQ();
    }
};

await testPublisher();