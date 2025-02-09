import { registerCommands } from '@modules/commands/commandRegistration';
import BaseCommand from '@modules/commands/models/BaseCommand';
import { Emojis } from '@modules/emojis/enums/Emojis';
import { sendTextReply } from '@modules/messaging/replying';
import { Client, CommandInteraction } from 'discord.js';

class RefreshCommandsCommand extends BaseCommand {
    name: string = 'refreshcommands';
    description: string = 'Refresh bot commands';

    override hasEphemeralResponse?: boolean | undefined = true;

    override onlyDevs?: boolean | undefined = true;
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        await registerCommands(client);
        await sendTextReply(interaction, `${Emojis.Check} Commands refreshed`);
    }
}

const command = new RefreshCommandsCommand();

export default command;