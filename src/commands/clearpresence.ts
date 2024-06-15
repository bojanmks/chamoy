import { PresenceUpdateStatus } from "discord.js";
import sendTextReply from "@modules/messaging/sendTextReply";
import setPresence from "@modules/presence/setPresence";
import presenceRatelimitUtil from "@modules/presence/presenceRatelimitUtil";
import { CHECK_EMOJI } from "@modules/shared/constants/emojis";

export default {
    name: 'clearpresence',
    description: 'Clear bot presence',
    callback: (client: any, interaction: any) => {
        presenceRatelimitUtil.onCanChangePresence(() => {
            setPresence(client, '', null, PresenceUpdateStatus.Online);
            sendTextReply(interaction, `${CHECK_EMOJI} Presence was cleared`, true);
        }, () => {
            presenceRatelimitUtil.sendPresenceChangeTimeLeftReply(interaction);
        });
    }
};