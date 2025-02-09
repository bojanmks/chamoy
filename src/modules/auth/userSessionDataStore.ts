import { ApplicationUser } from "./models/ApplicationUser"
import { REFRESH_TOKEN_EXPIRATION_IN_SECONDS } from "./constants/authConstants";
import { getRedisClient } from "@lib/redis/redis";

const USER_SESSION_DATA_REDIS_KEY = 'chamoyUserSessionData';

export const storeUserSessionData = async (userData: ApplicationUser) => {
    const redisClient = await getRedisClient();
    
    await redisClient.set(`${USER_SESSION_DATA_REDIS_KEY}:${userData.id}`, JSON.stringify(userData), {
        EX: REFRESH_TOKEN_EXPIRATION_IN_SECONDS
    });
}

export const findUserSessionDataByUserId = async (userId: string): Promise<ApplicationUser | null> => {
    const redisClient = await getRedisClient();

    const serializedUserData = await redisClient.get(`${USER_SESSION_DATA_REDIS_KEY}:${userId}`);

    if (!serializedUserData) {
        return null;
    }

    const parsedUserData: ApplicationUser = JSON.parse(serializedUserData);
    
    return parsedUserData;
}