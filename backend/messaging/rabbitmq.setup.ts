import { createRabbitChannel } from "../config/rabbitmq.connection.ts";
import { closeRabbitMQ } from "../config/rabbitmq.connection.ts";
import { initializeExchanges } from "./exchanges.ts";
import { initializeQueues } from "./queues.ts";

export const setupRabbitMQ = async (): Promise<void> => {
    let channel;
    try {
        channel = await createRabbitChannel();
        await initializeExchanges(channel);
        await initializeQueues(channel);
        console.log("RabbitMQ topology setup completed.");
    } catch (error) {
        console.error("RabbitMQ topology setup failed:", error);
        throw error;
    } finally {
        if (channel) {
            await channel.close();
        }

        await closeRabbitMQ();
    }
};