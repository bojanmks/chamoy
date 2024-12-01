import useCommands from "@modules/commands/useCommands";
import useHelp from "@modules/help/useHelp";
import { Client, CommandInteraction } from "discord.js";

const { handleHelpResponse } = useHelp();
const { BaseCommand } = useCommands();

class HelpCommand extends BaseCommand {
    name: string = 'help';
    description: string = 'Lists all commands';
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        await handleHelpResponse(client, interaction, interaction.user.id);
    }
}

const command = new HelpCommand();

export default command;