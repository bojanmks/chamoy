import sendGenericErrorReply from "@modules/errors/messages/sendGenericErrorReply";
import generateGamesInteractiveEmbedResponse from "@modules/games/generateGamesInteractiveEmbedResponse";
import sendReply from "@modules/messaging/sendReply";

export default {
    name: 'gamesinteractive',
    description: 'Get interactive embed with game links',
    callback: async (client: any, interaction: any) => {
        const response = generateGamesInteractiveEmbedResponse(client);

        if (!response) {
            sendGenericErrorReply(interaction);
            return;
        }
        
        await sendReply(interaction, response);
    }
};