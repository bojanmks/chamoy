const { X_EMOJI } = require("../../constants/emojis");
const sendTextReply = require("../messaging/sendTextReply");

let lastPresenceChangeTime;

const PRESENCE_CHANGE_COOLDOWN_IN_SECONDS = 15;

module.exports = {
    setPresenceChangeTime(time = null) {
        if (!time) time = new Date();
        lastPresenceChangeTime = time;
    },
    canChangePresence() {
        if (!lastPresenceChangeTime) return true;

        const secondsSinceLastChange = getSecondsSinceLastChange();
        return secondsSinceLastChange >= PRESENCE_CHANGE_COOLDOWN_IN_SECONDS;
    },
    async onCanChangePresence(successCallback, errorCallback = null) {
        if (this.canChangePresence()) {
            this.setPresenceChangeTime();
            await successCallback();
        }
        else if (errorCallback) {
            await errorCallback(PRESENCE_CHANGE_COOLDOWN_IN_SECONDS - getSecondsSinceLastChange());
        }
    },
    sendPresenceChangeTimeLeftReply(interaction) {
        const secondsLeft = PRESENCE_CHANGE_COOLDOWN_IN_SECONDS - getSecondsSinceLastChange();
        const roundedSeconds = Math.ceil(secondsLeft);
        sendTextReply(interaction, `${X_EMOJI} Please wait ${roundedSeconds} seconds`, true);
    }
};

function getSecondsSinceLastChange() {
    if (!lastPresenceChangeTime) return PRESENCE_CHANGE_COOLDOWN_IN_SECONDS + 1;
    return (new Date() - lastPresenceChangeTime) / 1000;
}