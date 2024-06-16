import { BaseCommand } from "@modules/commands/models/BaseCommand";
import handleHelpResponse from "@modules/help/handleHelpResponse";
import { Client, CommandInteraction } from "discord.js";

class HelpCommand extends BaseCommand {
    name: string = 'help';
    description: string = 'Lists all commands';
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        await handleHelpResponse(client, interaction, interaction.user.id);
    }
}

const command = new HelpCommand();

export default command;