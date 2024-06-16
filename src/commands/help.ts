import { BaseCommand } from "@models/commands/BaseCommand";
import handleHelpResponse from "@modules/help/handleHelpResponse";

class HelpCommand extends BaseCommand {
    name: string = 'help';
    description: string = 'Lists all commands';
    
    async callback(client: any, interaction: any): Promise<void> {
        await handleHelpResponse(client, interaction, interaction.user.id);
    }
}

const command = new HelpCommand();

export default command;