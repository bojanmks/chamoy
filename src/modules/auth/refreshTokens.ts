import { REFRESH_TOKEN_COOKIE_KEY, REFRESH_TOKEN_EXPIRATION_IN_SECONDS } from './constants/authConstants';

import { Response } from 'express';
import crypto from 'crypto';
import { getRedisClient } from '@lib/redis/redis';
import { isDevelopment } from '@modules/environments/environments';

const REFRESH_TOKEN_REDIS_KEY: string = "chamoyRefreshToken";

export const makeRefreshToken = (): string => {
    return crypto.randomBytes(64).toString("hex");
}

export const storeRefreshToken = async (userId: string, refreshToken: string) => {
    const redisClient = await getRedisClient();

    await redisClient.set(`${REFRESH_TOKEN_REDIS_KEY}:${userId}`, refreshToken, {
        EX: REFRESH_TOKEN_EXPIRATION_IN_SECONDS
    });
}

export const findUserIdByRefreshToken = async (refreshToken: string) => {
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

export const deleteUsersRefreshToken = async (userId: string) => {
    const redisClient = await getRedisClient();

    await redisClient.del(`${REFRESH_TOKEN_REDIS_KEY}:${userId}`);
}

export const setResponseRefreshTokenCookie = (res: Response, refreshToken: string) => {
    res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
        httpOnly: true,
        secure: !isDevelopment(),
        maxAge: REFRESH_TOKEN_EXPIRATION_IN_SECONDS * 1000
    });
}