import { BaseCommand } from "@modules/commands/models/BaseCommand";
import sendTextReply from "@modules/messaging/sendTextReply";
import { DEVELOPMENT_ENVIRONMENT } from "@modules/shared/constants/environments";
import { Client, CommandInteraction } from "discord.js";

class PingCommand extends BaseCommand {
    name: string = 'ping';
    description: string | null = '🏓';
    override environments: string[] | null = [DEVELOPMENT_ENVIRONMENT];
    
    execute(client: Client, interaction: CommandInteraction): void {
        sendTextReply(interaction, 'pong', true);
    }

}

const command = new PingCommand();

export default command;