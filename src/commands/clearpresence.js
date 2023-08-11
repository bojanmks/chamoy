const { ActivityType, PresenceUpdateStatus } = require("discord.js");
const { CHECK_EMOJI } = require("../constants/emojis");
const sendTextReply = require("../modules/messaging/sendTextReply");
const setPresence = require("../modules/presence/setPresence");

module.exports = {
    name: 'clearpresence',
    description: 'Clear bot presence',
    callback: (client, interaction) => {
        setPresence(client, '', null, PresenceUpdateStatus.Online);
        sendTextReply(interaction, `${CHECK_EMOJI} Presence was cleared`, true);
    }
};