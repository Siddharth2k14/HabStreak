import Redis from "ioredis";

const redisHost = process.env.REDIS_HOST;
const redisPort = Number(process.env.REDIS_PORT);

if (!Number.isInteger(redisPort) || redisPort < 1 || redisPort > 65535) {
    throw new Error("REDIS_PORT must be a valid TCP port.");
}

const redisConnection = new Redis({
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null,
});

export default redisConnection;