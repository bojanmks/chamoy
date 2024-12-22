import useCommands from '@modules/commands/useCommands';
import useCommandsRegistration from '@modules/commands/useCommandsRegistration';
import useEmojis from '@modules/emojis/useEmojis';
import useReplying from '@modules/messaging/useReplying';
import { Client, CommandInteraction } from 'discord.js';

const { registerCommands } = useCommandsRegistration();

const { sendTextReply } = useReplying();
const { BaseCommand } = useCommands();
const { CHECK_EMOJI } = useEmojis();

class RefreshCommandsCommand extends BaseCommand {
    name: string = 'refreshcommands';
    description: string = 'Refresh bot commands';

    override hasEphemeralResponse?: boolean | undefined = true;

    override onlyDevs?: boolean | undefined = true;
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        await registerCommands(client);
        await sendTextReply(interaction, `${CHECK_EMOJI} Commands refreshed`, true);
    }
}

const command = new RefreshCommandsCommand();

export default command;