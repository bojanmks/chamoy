import { ApplicationCommandType } from "discord.js";
import completeMemeMessageStore from "@modules/meme/completeMemeMessageStore";
import generateBaseEmbed from "@modules/embeds/generateBaseEmbed";
import sendReply from "@modules/messaging/sendReply";

export default {
    name: 'Meme',
    type: ApplicationCommandType.Message,
    callback: async (client: any, interaction: any) => {
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
};