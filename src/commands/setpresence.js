const { ApplicationCommandOptionType, ActivityType, PresenceUpdateStatus } = require("discord.js");
const setPresence = require("../modules/presence/setPresence");
const sendTextReply = require("../modules/messaging/sendTextReply");
const { CHECK_EMOJI } = require("../constants/emojis");

module.exports = {
    name: 'setpresence',
    description: 'Set bot presence',
    options: [
        {
            name: 'name',
            description: 'Activity name',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'type',
            description: 'Activity type',
            type: ApplicationCommandOptionType.Number,
            required: true,
            choices: [
                {
                    name: 'Competing',
                    value: ActivityType.Competing
                },
                {
                    name: 'Listening',
                    value: ActivityType.Listening
                },
                {
                    name: 'Playing',
                    value: ActivityType.Playing
                },
                {
                    name: 'Streaming',
                    value: ActivityType.Streaming
                },
                {
                    name: 'Watching',
                    value: ActivityType.Watching
                }
            ]
        },
        {
            name: 'status',
            description: 'Bot status',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Do not disturb',
                    value: PresenceUpdateStatus.DoNotDisturb
                },
                {
                    name: 'Idle',
                    value: PresenceUpdateStatus.Idle
                },
                {
                    name: 'Online',
                    value: PresenceUpdateStatus.Online
                }
            ]
        }
    ],
    callback: (client, interaction) => {
        const activityName = interaction.options.get('name').value;
        const activityType = interaction.options.get('type').value;
        const status = interaction.options.get('status').value;

        setPresence(client, activityName, activityType, status);

        sendTextReply(interaction, `${CHECK_EMOJI} Presence was set`, true);
    }
};