import { BaseCommand } from "@modules/commands/models/BaseCommand";
import sendTextReply from "@modules/messaging/sendTextReply";
import { DEVELOPMENT_ENVIRONMENT } from "@modules/shared/constants/environments";

class PingCommand extends BaseCommand {
    name: string = 'ping';
    description: string | null = '🏓';
    override environments: string[] | null = [DEVELOPMENT_ENVIRONMENT];
    
    callback(client: any, interaction: any): void {
        sendTextReply(interaction, 'pong', true);
    }

}

const command = new PingCommand();

export default command;