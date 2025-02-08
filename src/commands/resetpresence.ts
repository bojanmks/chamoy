import useCommands from "@modules/commands/useCommands";
import useEmojis from "@modules/emojis/useEmojis";
import useReplying from "@modules/messaging/useReplying";
import usePresence from "@modules/presence/usePresence";
import usePresenceRateLimiting from "@modules/presence/usePresenceRateLimiting";
import { Client, CommandInteraction } from "discord.js";

const { defaultPresence } = usePresence();
const { onCanChangePresence, sendPresenceChangeTimeLeftReply } = usePresenceRateLimiting();
const { sendTextReply } = useReplying();
const { CHECK_EMOJI } = useEmojis();
const { BaseCommand } = useCommands();

class ResetPresenceCommand extends BaseCommand {
    name: string = 'resetpresence';
    override description?: string = 'Reset bot presence to the default presence';

    override hasEphemeralResponse?: boolean | undefined = true;
    
    execute(client: Client, interaction: CommandInteraction): void {
        onCanChangePresence(async () => {
            client.user?.setPresence(defaultPresence);
            await sendTextReply(interaction, `${CHECK_EMOJI} Presence was reset`);
        }, async () => {
            await sendPresenceChangeTimeLeftReply(interaction);
        });
    }
}

const command = new ResetPresenceCommand();

export default command;