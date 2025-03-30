import { Client } from "discord.js";

export const setPresence = (client: Client, activityName: any, activityType: any, status: any) => {
    client.user?.setPresence({
        activities: [
            {
                name: activityName,
                type: activityType
            }
        ],
        status: status
    });
}