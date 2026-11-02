import dotenv from "dotenv";
dotenv.config();

import {
    connectRabbitMQ,
    closeRabbitMQ,
} from "../config/rabbitmq.connection.ts"

try {
    await connectRabbitMQ();

    console.log("RabbitMQ channel created successfully");
    console.log("RabbitMQ test completed successfully");

} catch (error) {
    console.error("RabbitMQ test failed:", error);
    process.exitCode = 1;

} finally {
    await closeRabbitMQ();
}
