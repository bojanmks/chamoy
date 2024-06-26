import { default as axios } from "axios";
import sendGenericErrorReply from '@modules/errors/messages/sendGenericErrorReply';
import sendTextReply from '@modules/messaging/sendTextReply';
import { PRODUCTION_ENVIRONMENT } from '@modules/shared/constants/environments';
import { BaseCommand } from "@modules/commands/models/BaseCommand";
import { Client, CommandInteraction } from "discord.js";

class RestartCommand extends BaseCommand {
    name: string = 'restart';
    description: string | null = 'Restarts the bot';
    override onlyDevs: boolean = true;
    override environments: string[] | null = [PRODUCTION_ENVIRONMENT];
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        sendTextReply(interaction, ':arrows_counterclockwise: Restarting', true);

        const body = {
            signal: 'restart'
        };

        const headers = {
            'Authorization': 'Bearer ' + process.env.SPARKEDHOST_API_KEY
        };

        await axios.post(process.env.POWER_API_ENDPOINT!, body, { headers })
            .catch((error: any) => {
                console.error('❌ Error restarting the bot:');
                console.error(error);
                sendGenericErrorReply(interaction);
            });
    }
}

const command = new RestartCommand();

export default command;