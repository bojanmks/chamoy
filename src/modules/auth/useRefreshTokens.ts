import crypto from 'crypto';
import useRedis from "@lib/redis/useRedis"
import useAuthConstants from "./useAuthConstants";

const { getRedisClient } = useRedis();
const { REFRESH_TOKEN_EXPIRATION_IN_SECONDS } = useAuthConstants();

const REFRESH_TOKEN_REDIS_KEY: string = "chamoyRefreshToken";

const makeRefreshToken = (): string => {
    return crypto.randomBytes(64).toString("hex");
}

const storeRefreshToken = async (userId: string, refreshToken: string) => {
    const redisClient = await getRedisClient();

    await redisClient.set(`${REFRESH_TOKEN_REDIS_KEY}:${userId}`, refreshToken, {
        EX: REFRESH_TOKEN_EXPIRATION_IN_SECONDS
    });
}

const findUserIdByRefreshToken = async (refreshToken: string) => {
    const redisClient = await getRedisClient();
    const keys = await redisClient.keys(`${REFRESH_TOKEN_REDIS_KEY}:*`);

    let userId: string | null = null;

    for (const key of keys) {
        const storedToken = await redisClient.get(key);
        if (storedToken === refreshToken) {
            userId = key.split(":")[1];
            break;
        }
    }

    return userId;
}

const deleteUsersRefreshToken = async (userId: string) => {
    const redisClient = await getRedisClient();

    await redisClient.del(`${REFRESH_TOKEN_REDIS_KEY}:${userId}`);
}

export default () => {
    return {
        makeRefreshToken,
        storeRefreshToken,
        findUserIdByRefreshToken,
        deleteUsersRefreshToken
    }
}