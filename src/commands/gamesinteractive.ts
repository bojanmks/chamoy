const sendGenericErrorReply = require("@modules/errors/messages/sendGenericErrorReply");
const generateGamesInteractiveEmbedResponse = require("@modules/games/generateGamesInteractiveEmbedResponse");
const sendReply = require("@modules/messaging/sendReply");

module.exports = {
    name: 'gamesinteractive',
    description: 'Get interactive embed with game links',
    callback: async (client, interaction) => {
        const response = generateGamesInteractiveEmbedResponse(client);

        if (!response) {
            sendGenericErrorReply(interaction);
            return;
        }
        
        await sendReply(interaction, response);
    }
};