import useEmojis from "@modules/emojis/useEmojis";
import useReplying from "@modules/messaging/useReplying";

const { sendTextReply } = useReplying();
const { X_EMOJI } = useEmojis();

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

const onCanChangePresence = async (successCallback: any, errorCallback: Function | null = null) => {
    if (canChangePresence()) {
        setPresenceChangeTime();
        await successCallback();
    }
    else if (errorCallback) {
        await errorCallback(PRESENCE_CHANGE_COOLDOWN_IN_SECONDS - getSecondsSinceLastChange());
    }
}

const sendPresenceChangeTimeLeftReply = (interaction: any) => {
    const secondsLeft = PRESENCE_CHANGE_COOLDOWN_IN_SECONDS - getSecondsSinceLastChange();
    const roundedSeconds = Math.ceil(secondsLeft);
    return sendTextReply(interaction, `${X_EMOJI} Please wait ${roundedSeconds} seconds`, true);
}

const getSecondsSinceLastChange = (): number => {
    if (!lastPresenceChangeTime) {
        return PRESENCE_CHANGE_COOLDOWN_IN_SECONDS + 1;
    }
    
    return (Date.now() - lastPresenceChangeTime) / 1000;
}

export default () => {
    return {
        onCanChangePresence,
        sendPresenceChangeTimeLeftReply
    }
}