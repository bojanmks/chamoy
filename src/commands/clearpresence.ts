import { Client, CommandInteraction, PresenceUpdateStatus } from "discord.js";
import usePresenceRateLimiting from "@modules/presence/usePresenceRateLimiting";
import usePresence from "@modules/presence/usePresence";
import useReplying from "@modules/messaging/useReplying";
import useEmojis from "@modules/emojis/useEmojis";
import useCommands from "@modules/commands/useCommands";

const { setPresence } = usePresence();
const { onCanChangePresence, sendPresenceChangeTimeLeftReply } = usePresenceRateLimiting();
const { sendTextReply } = useReplying();
const { CHECK_EMOJI } = useEmojis();
const { BaseCommand } = useCommands();

class ClearPresenceCommand extends BaseCommand {
    name: string = 'clearpresence';
    description: string = 'Clear bot presence';

    override hasEphemeralResponse?: boolean | undefined = true;
    
    execute(client: Client, interaction: CommandInteraction): void {
        onCanChangePresence(() => {
            setPresence(client, '', null, PresenceUpdateStatus.Online);
            sendTextReply(interaction, `${CHECK_EMOJI} Presence was cleared`, true);
        }, () => {
            sendPresenceChangeTimeLeftReply(interaction);
        });
    }
}

const command = new ClearPresenceCommand();

export default command;