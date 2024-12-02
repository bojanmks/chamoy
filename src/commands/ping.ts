import useCommands from "@modules/commands/useCommands";
import useEnvironments from "@modules/environments/useEnvironments";
import useReplying from "@modules/messaging/useReplying";
import { Client, CommandInteraction } from "discord.js";

const { sendTextReply } = useReplying();
const { DEVELOPMENT_ENVIRONMENT } = useEnvironments();
const { BaseCommand } = useCommands();

class PingCommand extends BaseCommand {
    name: string = 'ping';
    description?: string = '🏓';
    
    override environments?: string[] = [DEVELOPMENT_ENVIRONMENT];

    override hasEphemeralResponse?: boolean | undefined = true;
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        await sendTextReply(interaction, 'pong', true);
    }

}

const command = new PingCommand();

export default command;