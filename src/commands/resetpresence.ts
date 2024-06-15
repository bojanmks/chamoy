
const sendTextReply = require("@modules/messaging/sendTextReply");
const defaultPresence = require("@modules/presence/defaultPresence");
const presenceRatelimitUtil = require("@modules/presence/presenceRatelimitUtil");
const { CHECK_EMOJI } = require("@modules/shared/constants/emojis");

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