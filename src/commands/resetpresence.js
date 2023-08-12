const { CHECK_EMOJI } = require("../constants/emojis");
const sendTextReply = require("../modules/messaging/sendTextReply");
const defaultPresence = require("../modules/presence/defaultPresence");
const presenceRatelimitUtil = require("../modules/presence/presenceRatelimitUtil");

module.exports = {
    name: 'resetpresence',
    description: 'Reset bot presence to the default presence',
    callback: (client, interaction) => {
        presenceRatelimitUtil.onCanChangePresence(() => {
            client.user.setPresence(defaultPresence());
            sendTextReply(interaction, `${CHECK_EMOJI} Presence was reset`, true);
        }, () => {
            presenceRatelimitUtil.sendPresenceChangeTimeLeftReply(interaction);
        });
    }
};