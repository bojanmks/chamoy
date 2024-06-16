import { PresenceUpdateStatus } from "discord.js";
import sendTextReply from "@modules/messaging/sendTextReply";
import setPresence from "@modules/presence/setPresence";
import presenceRatelimitUtil from "@modules/presence/presenceRatelimitUtil";
import { CHECK_EMOJI } from "@modules/shared/constants/emojis";
import { BaseCommand } from "@modules/commands/models/BaseCommand";

class ClearPresenceCommand extends BaseCommand {
    name: string = 'clearpresence';
    description: string = 'Clear bot presence';
    
    callback(client: any, interaction: any): void {
        presenceRatelimitUtil.onCanChangePresence(() => {
            setPresence(client, '', null, PresenceUpdateStatus.Online);
            sendTextReply(interaction, `${CHECK_EMOJI} Presence was cleared`, true);
        }, () => {
            presenceRatelimitUtil.sendPresenceChangeTimeLeftReply(interaction);
        });
    }
}

const command = new ClearPresenceCommand();

export default command;