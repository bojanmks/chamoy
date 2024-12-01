import { default as axios } from "axios";
import { Client, CommandInteraction } from "discord.js";
import useReplying from "@modules/messaging/useReplying";
import useErrorReplying from "@modules/errors/useErrorReplying";
import useEnvironments from "@modules/environments/useEnvironments";
import useCommands from "@modules/commands/useCommands";

const { sendTextReply } = useReplying();
const { sendGenericErrorReply } = useErrorReplying();
const { PRODUCTION_ENVIRONMENT } = useEnvironments();
const { BaseCommand } = useCommands();

class RestartCommand extends BaseCommand {
    name: string = 'restart';
    description?: string = 'Restarts the bot';
    override onlyDevs: boolean = true;
    override environments?: string[] = [PRODUCTION_ENVIRONMENT];
    
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