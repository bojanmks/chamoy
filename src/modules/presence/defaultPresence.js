const { ActivityType, PresenceUpdateStatus } = require("discord.js");

module.exports = () => {
    return {
        activities: [
            {
                name: 'Lethal Company',
                type: ActivityType.Playing
            }
        ],
        status: PresenceUpdateStatus.DoNotDisturb
    };
};