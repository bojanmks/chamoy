const { ActivityType, PresenceUpdateStatus } = require("discord.js");

module.exports = () => {
    return {
        activities: [
            {
                name: 'VOYAGE X DEVITO - MAFIA (OFFICIAL VIDEO)',
                type: ActivityType.Listening
            }
        ],
        status: PresenceUpdateStatus.DoNotDisturb
    };
};