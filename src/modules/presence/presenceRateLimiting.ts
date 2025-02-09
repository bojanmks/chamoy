import { Emojis } from "@modules/emojis/enums/Emojis";
import { sendTextReply } from "@modules/messaging/replying";

let lastPresenceChangeTime: number;

const PRESENCE_CHANGE_COOLDOWN_IN_SECONDS = 15;

const setPresenceChangeTime = (time: number | null = null) => {
    if (!time) time = Date.now();
    lastPresenceChangeTime = time;
}

const canChangePresence = () => {
    if (!lastPresenceChangeTime) {
        return true;
    }

    const secondsSinceLastChange = getSecondsSinceLastChange();
    return secondsSinceLastChange >= PRESENCE_CHANGE_COOLDOWN_IN_SECONDS;
}

export const onCanChangePresence = async (successCallback: any, errorCallback: Function | null = null) => {
    if (canChangePresence()) {
        setPresenceChangeTime();
        await successCallback();
    }
    else if (errorCallback) {
        await errorCallback(PRESENCE_CHANGE_COOLDOWN_IN_SECONDS - getSecondsSinceLastChange());
    }
}

export const sendPresenceChangeTimeLeftReply = (interaction: any) => {
    const secondsLeft = PRESENCE_CHANGE_COOLDOWN_IN_SECONDS - getSecondsSinceLastChange();
    const roundedSeconds = Math.ceil(secondsLeft);
    return sendTextReply(interaction, `${Emojis.X} Please wait ${roundedSeconds} seconds`);
}

const getSecondsSinceLastChange = (): number => {
    if (!lastPresenceChangeTime) {
        return PRESENCE_CHANGE_COOLDOWN_IN_SECONDS + 1;
    }
    
    return (Date.now() - lastPresenceChangeTime) / 1000;
}