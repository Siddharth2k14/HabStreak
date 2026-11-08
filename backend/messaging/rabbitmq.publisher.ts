import type { ConfirmChannel, Message } from "amqplib";

import { EXCHANGES } from "./exchanges.ts";

interface PublishMetadata {
    messageId: string;
    eventType: string;
}

export const publishMessage = async <T>(
    channel: ConfirmChannel,
    routingKey: string,
    message: T,
    metadata: PublishMetadata
): Promise<void> => {
    if (!metadata.messageId || !metadata.eventType) {
        throw new Error("RabbitMQ message metadata is incomplete");
    }

    const payload = Buffer.from(
        JSON.stringify(message),
        "utf-8"
    );

    await new Promise<void>((resolve, reject) => {
        let returnedMessage: Message | null = null;

        const handleReturn = (returned: Message) => {
            if (returned.properties.messageId === metadata.messageId) {
                returnedMessage = returned;
            }
        };
        
        channel.on("return", handleReturn);

        const cleanup = () => {
            channel.removeListener("return", handleReturn);
        };


        try {
            channel.publish(
                EXCHANGES.EVENTS,
                routingKey,
                payload,
                {
                    persistent: true,
                    mandatory: true,
                    contentType: "application/json",
                    contentEncoding: "utf-8",
                    messageId: metadata.messageId,
                    timestamp: Math.floor(Date.now() / 1000),
                    type: metadata.eventType,
                    headers: {
                        schemaVersion: 1,
                    },
                },
                (error) => {
                    cleanup();

                    if (error) {
                        reject(error);
                        return;
                    }

                    if (returnedMessage) {
                        reject(
                            new Error(
                                `Unroutable RabbitMQ message: ` +
                                `exchange=${returnedMessage.fields.exchange}, ` +
                                `routingKey=${returnedMessage.fields.routingKey}`
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