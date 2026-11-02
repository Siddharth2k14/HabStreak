export const getRabbitMQConfig = () => {
    const host = process.env.RABBITMQ_HOST;
    const port = Number(process.env.RABBITMQ_PORT);
    const user = process.env.RABBITMQ_USER;
    const password = process.env.RABBITMQ_PASSWORD;
    const vhost = process.env.RABBITMQ_VHOST?.trim() || "/";

    if (!host || !user || !password) {
        throw new Error(
            "RabbitMQ environment variables are missing."
        );
    }

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error("Invalid RabbitMQ port.");
    }

    return {
        protocol: "amqp" as const,
        hostname: host,
        port,
        username: user,
        password,
        vhost,
    };
};