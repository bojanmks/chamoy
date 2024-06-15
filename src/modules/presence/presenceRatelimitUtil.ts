import sendTextReply from "@modules/messaging/sendTextReply";
import { X_EMOJI } from "@modules/shared/constants/emojis";

let lastPresenceChangeTime: number;

const PRESENCE_CHANGE_COOLDOWN_IN_SECONDS = 15;

export default {
    setPresenceChangeTime(time: number | null = null) {
        if (!time) time = Date.now();
        lastPresenceChangeTime = time;
    },
    canChangePresence() {
        if (!lastPresenceChangeTime) return true;

        const secondsSinceLastChange = getSecondsSinceLastChange();
        return secondsSinceLastChange >= PRESENCE_CHANGE_COOLDOWN_IN_SECONDS;
    },
    async onCanChangePresence(successCallback: any, errorCallback: Function | null = null) {
        if (this.canChangePresence()) {
            this.setPresenceChangeTime();
            await successCallback();
        }
        else if (errorCallback) {
            await errorCallback(PRESENCE_CHANGE_COOLDOWN_IN_SECONDS - getSecondsSinceLastChange());
        }
    },
    sendPresenceChangeTimeLeftReply(interaction: any) {
        const secondsLeft = PRESENCE_CHANGE_COOLDOWN_IN_SECONDS - getSecondsSinceLastChange();
        const roundedSeconds = Math.ceil(secondsLeft);
        sendTextReply(interaction, `${X_EMOJI} Please wait ${roundedSeconds} seconds`, true);
    }
};

function getSecondsSinceLastChange(): number {
    if (!lastPresenceChangeTime) return PRESENCE_CHANGE_COOLDOWN_IN_SECONDS + 1;
    return (Date.now() - lastPresenceChangeTime) / 1000;
}