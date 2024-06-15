
import sendTextReply from "@modules/messaging/sendTextReply";
import defaultPresence from "@modules/presence/defaultPresence";
import presenceRatelimitUtil from "@modules/presence/presenceRatelimitUtil";
import { CHECK_EMOJI } from "@modules/shared/constants/emojis";

export default {
    name: 'resetpresence',
    description: 'Reset bot presence to the default presence',
    callback: (client: any, interaction: any) => {
        presenceRatelimitUtil.onCanChangePresence(() => {
            client.user.setPresence(defaultPresence());
            sendTextReply(interaction, `${CHECK_EMOJI} Presence was reset`, true);
        }, () => {
            presenceRatelimitUtil.sendPresenceChangeTimeLeftReply(interaction);
        });
    }
};