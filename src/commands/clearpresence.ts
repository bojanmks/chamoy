import { Client, CommandInteraction, PresenceUpdateStatus } from "discord.js";
import BaseCommand from "@modules/commands/models/BaseCommand";
import { sendTextReply } from "@modules/messaging/replying";
import { Emojis } from "@modules/emojis/enums/Emojis";
import { setPresence } from "@modules/presence/presence";
import { onCanChangePresence, sendPresenceChangeTimeLeftReply } from "@modules/presence/presenceRateLimiting";

class ClearPresenceCommand extends BaseCommand {
    name: string = 'clearpresence';
    description: string = 'Clear bot presence';

    override hasEphemeralResponse?: boolean | undefined = true;
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        onCanChangePresence(async () => {
            setPresence(client, '', null, PresenceUpdateStatus.Online);
            await sendTextReply(interaction, `${Emojis.Check} Presence was cleared`);
        }, async () => {
            await sendPresenceChangeTimeLeftReply(interaction);
        });
    }
}

const command = new ClearPresenceCommand();

export default command;