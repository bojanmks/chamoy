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

    override hasEphemeralResponse?: boolean | undefined = true;
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        await sendTextReply(interaction, ':arrows_counterclockwise: Restarting', true);

        const body = {
            signal: 'restart'
        };

        const headers = {
            'Authorization': 'Bearer ' + process.env.SPARKEDHOST_API_KEY
        };

        try {
            await axios.post(process.env.POWER_API_ENDPOINT!, body, { headers });
        }
        catch (error) {
            console.error('❌ Error restarting the bot:');
            console.error(error);
            await sendGenericErrorReply(interaction);
        }
    }
}

const command = new RestartCommand();

export default command;