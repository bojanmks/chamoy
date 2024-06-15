const sendGenericErrorReply = require("@modules/errors/messages/sendGenericErrorReply");
const { GAMES_INTERACTIVE_DROPDOWN_ID_PREFIX, GAMES_INTERACTIVE_REFRESH_BUTTON_ID_PREFIX } = require("@modules/games/gamesConstants");
const generateGamesInteractiveEmbedResponse = require("@modules/games/generateGamesInteractiveEmbedResponse");

module.exports = (client, interaction) => {
    if (interaction.customId?.startsWith(GAMES_INTERACTIVE_DROPDOWN_ID_PREFIX)) {
        const selectedGameId = parseInt(interaction.values[0]);
        handleGameSelect(client, interaction, selectedGameId);
        return;
    }
    
    if (interaction.customId?.startsWith(GAMES_INTERACTIVE_REFRESH_BUTTON_ID_PREFIX)) {
        const selectedGameId = parseInt(interaction.customId.split('-')[1]);
        handleGameSelect(client, interaction, selectedGameId);
        return;
    }
}

function handleGameSelect(client, interaction, selectedGameId) {
    const response = generateGamesInteractiveEmbedResponse(client, selectedGameId);

    if (!response) {
        sendGenericErrorReply(interaction);
        return;
    }

    interaction.update(response);
}