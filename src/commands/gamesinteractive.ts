import { BaseCommand } from "@modules/commands/models/BaseCommand";
import sendGenericErrorReply from "@modules/errors/messages/sendGenericErrorReply";
import generateGamesInteractiveEmbedResponse from "@modules/games/generateGamesInteractiveEmbedResponse";
import sendReply from "@modules/messaging/sendReply";

class GamesInteractiveCommand extends BaseCommand {
    name: string = 'gamesinteractive';
    description: string = 'Get interactive embed with game links';
    
    async callback(client: any, interaction: any): Promise<void> {
        const response = generateGamesInteractiveEmbedResponse(client);

        if (!response) {
            sendGenericErrorReply(interaction);
            return;
        }
        
        await sendReply(interaction, response);
    }
}

const command = new GamesInteractiveCommand();

export default command;