import { Response } from 'express';
import crypto from 'crypto';
import useAuthConstants from "./useAuthConstants";
import useEnvironments from '@modules/environments/useEnvironments';
import useRedis from "@lib/redis/useRedis"

const { getRedisClient } = useRedis();
const { REFRESH_TOKEN_EXPIRATION_IN_SECONDS, REFRESH_TOKEN_COOKIE_KEY } = useAuthConstants();
const { isDevelopment } = useEnvironments();

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

const setResponseRefreshTokenCookie = (res: Response, refreshToken: string) => {
    res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
        httpOnly: true,
        secure: !isDevelopment(),
        maxAge: REFRESH_TOKEN_EXPIRATION_IN_SECONDS * 1000
    });
}

export default () => {
    return {
        makeRefreshToken,
        storeRefreshToken,
        findUserIdByRefreshToken,
        deleteUsersRefreshToken,
        setResponseRefreshTokenCookie
    }
}