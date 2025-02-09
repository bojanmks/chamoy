import BaseCommand from "@modules/commands/models/BaseCommand";
import { Emojis } from "@modules/emojis/enums/Emojis";
import { sendTextReply } from "@modules/messaging/replying";
import { defaultPresence } from "@modules/presence/presence";
import { onCanChangePresence, sendPresenceChangeTimeLeftReply } from "@modules/presence/presenceRateLimiting";
import { Client, CommandInteraction } from "discord.js";

class ResetPresenceCommand extends BaseCommand {
    name: string = 'resetpresence';
    override description?: string = 'Reset bot presence to the default presence';

    override hasEphemeralResponse?: boolean | undefined = true;
    
    execute(client: Client, interaction: CommandInteraction): void {
        onCanChangePresence(async () => {
            client.user?.setPresence(defaultPresence);
            await sendTextReply(interaction, `${Emojis.Check} Presence was reset`);
        }, async () => {
            await sendPresenceChangeTimeLeftReply(interaction);
        });
    }
}

const command = new ResetPresenceCommand();

export default command;