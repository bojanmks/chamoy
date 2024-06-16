
import { BaseCommand } from "@modules/commands/models/BaseCommand";
import sendTextReply from "@modules/messaging/sendTextReply";
import defaultPresence from "@modules/presence/defaultPresence";
import presenceRatelimitUtil from "@modules/presence/presenceRatelimitUtil";
import { CHECK_EMOJI } from "@modules/shared/constants/emojis";

class ResetPresenceCommand extends BaseCommand {
    name: string = 'resetpresence';
    description: string | null = 'Reset bot presence to the default presence';
    
    callback(client: any, interaction: any): void {
        presenceRatelimitUtil.onCanChangePresence(() => {
            client.user.setPresence(defaultPresence());
            sendTextReply(interaction, `${CHECK_EMOJI} Presence was reset`, true);
        }, () => {
            presenceRatelimitUtil.sendPresenceChangeTimeLeftReply(interaction);
        });
    }
}

const command = new ResetPresenceCommand();

export default command;