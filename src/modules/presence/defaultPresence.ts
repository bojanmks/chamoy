const { ActivityType, PresenceUpdateStatus } = require("discord.js");

export default () => {
    return {
        activities: [
            {
                name: 'Drive (2011)',
                type: ActivityType.Watching
            }
        ],
        status: PresenceUpdateStatus.Idle
    };
};