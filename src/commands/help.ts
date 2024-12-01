import useCommands from "@modules/commands/useCommands";
import useHelp from "@modules/help/useHelp";
import useReplying from "@modules/messaging/useReplying";
import { Client, CommandInteraction } from "discord.js";

const { handleHelpResponse, listenToHelpEmbedInteractions } = useHelp();
const { BaseCommand } = useCommands();
const { sendReply } = useReplying();

class HelpCommand extends BaseCommand {
    name: string = 'help';
    description: string = 'Lists all commands';

    override hasEphemeralResponse?: boolean | undefined = true;
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const userId = interaction.user.id;

        const messageToSend = await handleHelpResponse(client, interaction, userId);

        const sentMessage = await sendReply(interaction, messageToSend);

        await listenToHelpEmbedInteractions(client, userId, sentMessage);
    }
}

const command = new HelpCommand();

export default command;