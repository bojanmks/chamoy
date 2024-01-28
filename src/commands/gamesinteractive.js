const sendGenericErrorReply = require("@modules/errors/messages/sendGenericErrorReply");
const generateGamesInteractiveEmbedResponse = require("@modules/games/generateGamesInteractiveEmbedResponse");
const sendReply = require("@modules/messaging/sendReply");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'gamesinteractive',
    description: 'Get interactive embed with game links',
    options: [
        {
            name: 'ephemeral',
            description: 'Should message be only visible to you',
            type: ApplicationCommandOptionType.Boolean
        }
    ],
    callback: async (client, interaction) => {
        const response = generateGamesInteractiveEmbedResponse(client);

        if (!response) {
            sendGenericErrorReply(interaction);
            return;
        }

        await sendReply(interaction, response);
    }
};