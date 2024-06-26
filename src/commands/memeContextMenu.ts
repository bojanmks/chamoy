import { ApplicationCommandType, Client, MessageContextMenuCommandInteraction } from "discord.js";
import completeMemeMessageStore from "@modules/meme/completeMemeMessageStore";
import generateBaseEmbed from "@modules/embeds/generateBaseEmbed";
import sendReply from "@modules/messaging/sendReply";
import { BaseCommand } from "@modules/commands/models/BaseCommand";

class MemeContextMenuCommand extends BaseCommand {
    name: string = 'Meme';
    description: string | null = null;
    override type: ApplicationCommandType = ApplicationCommandType.Message;
    
    async execute(client: Client, interaction: MessageContextMenuCommandInteraction): Promise<void> {
        const message = interaction.targetMessage;
        completeMemeMessageStore.addMessage(message.author.id, message.id);

        const embed = generateBaseEmbed(client, 'Meme prepared');

        embed.addFields({
            name: 'Complete the meme with:',
            value: '/completememe ``<toptext>`` ``<bottomtext>``',
            inline: false
        });

        sendReply(interaction, {
            embeds: [embed],
            ephemeral: true
        });
    }

}

const command = new MemeContextMenuCommand();

export default command;