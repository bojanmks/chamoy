const { ActivityType, PresenceUpdateStatus } = require("discord.js");

module.exports = () => {
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