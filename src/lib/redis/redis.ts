import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD
});

export const getRedisClient = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    return redisClient;
}