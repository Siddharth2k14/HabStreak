import { setupRabbitMQ } from "../messaging/rabbitmq.setup.ts";

try {
    await setupRabbitMQ();

    console.log("RabbitMQ topology test passed.");
} catch (error) {
    console.error("RabbitMQ topology test failed:", error);
    process.exitCode = 1;
}