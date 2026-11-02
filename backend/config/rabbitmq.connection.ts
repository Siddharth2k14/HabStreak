import amqp, {
    type Channel,
    type ConfirmChannel,
    type ChannelModel,
} from "amqplib";

import { getRabbitMQConfig } from "./rabbitmq.config.ts";

let connection: ChannelModel | null = null;
let connectionPromise: Promise<ChannelModel> | null = null;

export const connectRabbitMQ = async (): Promise<ChannelModel> => {

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

                connection = null;
                connectionPromise = null;
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
    const currentConnection = connection;

    connection = null;
    connectionPromise = null;

    if (currentConnection) {
        await currentConnection.close();
        console.log("RabbitMQ connection closed gracefully.");
    }
};