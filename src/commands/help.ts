import BaseCommand from "@modules/commands/models/BaseCommand";
import { handleHelpResponse, listenToHelpEmbedInteractions } from "@modules/help/help";
import { sendReply } from "@modules/messaging/replying";
import { Client, CommandInteraction } from "discord.js";

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