import { ActivityType, Client, PresenceData, PresenceUpdateStatus } from "discord.js";

const defaultPresence: PresenceData = {
    activities: [
        {
            name: 'Bladerunner 2049',
            type: ActivityType.Watching
        }
    ],
    status: PresenceUpdateStatus.DoNotDisturb
};

const setPresence = (client: Client, activityName: any, activityType: any, status: any) => {
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

export default () => {
    return {
        defaultPresence,
        setPresence
    }
}