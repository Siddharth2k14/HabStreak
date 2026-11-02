import dotenv from "dotenv";
import amqp from "amqplib";

dotenv.config({ path: "backend/.env" });

const user = encodeURIComponent(process.env.RABBITMQ_USER);
const password = encodeURIComponent(process.env.RABBITMQ_PASSWORD);

const url = `amqp://${user}:${password}@127.0.0.1:5672/`;

console.log("Testing RabbitMQ URL authentication...");

let connection;

try {
    connection = await amqp.connect(url);

    console.log("RabbitMQ URL authentication successful!");

    const channel = await connection.createChannel();
    console.log("Channel created successfully!");

    await channel.close();
} catch (error) {
    console.error("Connection failed:", error.message);
    process.exitCode = 1;
} finally {
    if (connection) {
        await connection.close();
    }
}