
import amqp, {
    type Channel,
    type ConfirmChannel,
    type ChannelModel,
} from "amqplib";

import { getRabbitMQConfig } from "./rabbitmq.config.ts";

let connection: ChannelModel | null = null;
let connectionPromise: Promise<ChannelModel> | null = null;
let closing = false;

const resetConnection = (target: ChannelModel): void => {
    if (connection !== target) return;

    connection = null;
    connectionPromise = null;
};

export const connectRabbitMQ = async (): Promise<ChannelModel> => {
    if (closing) {
        throw new Error("RabbitMQ connection is shutting down.");
    }

    if (connection) {
        return connection;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    connectionPromise = amqp
        .connect(getRabbitMQConfig())
        .then((rabbitConnection) => {
            connection = rabbitConnection;

            console.log("RabbitMQ connected successfully!");

            rabbitConnection.on("error", (error) => {
                console.error("RabbitMQ connection error:", error);
            });

            rabbitConnection.once("close", () => {
                console.warn("RabbitMQ connection closed.");
                resetConnection(rabbitConnection);
            });

            return rabbitConnection;
        })
        .catch((error) => {
            connection = null;
            connectionPromise = null;

            console.error("RabbitMQ connection failed:", error);
            throw error;
        });

    return connectionPromise;
};

export const createRabbitChannel = async (): Promise<Channel> => {
    const rabbitConnection = await connectRabbitMQ();
    return rabbitConnection.createChannel();
};

export const createConfirmChannel = async (): Promise<ConfirmChannel> => {
    const rabbitConnection = await connectRabbitMQ();
    return rabbitConnection.createConfirmChannel();
};

export const closeRabbitMQ = async (): Promise<void> => {
    if (closing) return;

    closing = true;

    const pendingConnection = connectionPromise;

    try {
        // Wait for an ongoing connection attempt to settle.
        if (!connection && pendingConnection) {
            try {
                await pendingConnection;
            } catch {
                // Connection was never established.
            }
        }

        const currentConnection = connection;

        if (currentConnection) {
            await currentConnection.close();
            console.log("RabbitMQ connection closed gracefully.");
        }
    } finally {
        connection = null;
        connectionPromise = null;
        closing = false;
    }
};
