const { ActivityType, PresenceUpdateStatus } = require("discord.js");

module.exports = () => {
    return {
        activities: [
            {
                name: 'Mamuti na Ostrvu',
                type: ActivityType.Watching
            }
        ],
        status: PresenceUpdateStatus.DoNotDisturb
    };
};