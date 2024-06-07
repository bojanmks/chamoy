const { ApplicationCommandType } = require("discord.js");
const completeMemeMessageStore = require("@modules/meme/completeMemeMessageStore");
const generateBaseEmbed = require("@modules/embeds/generateBaseEmbed");
const sendReply = require("@modules/messaging/sendReply");

module.exports = {
    name: 'Meme',
    type: ApplicationCommandType.Message,
    callback: async (client, interaction) => {
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