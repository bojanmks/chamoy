import useErrorReplying from "@modules/errors/useErrorReplying";
import useGameEmbeds from "@modules/games/useGameEmbeds";
import useGamesConstants from "@modules/games/useGamesConstants";

const { sendGenericErrorReply } = useErrorReplying();
const { GAMES_INTERACTIVE_DROPDOWN_ID_PREFIX, GAMES_INTERACTIVE_REFRESH_BUTTON_ID_PREFIX } = useGamesConstants();
const { makeInteractiveGameEmbed } = useGameEmbeds();

export default (client: any, interaction: any) => {
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

function handleGameSelect(client: any, interaction: any, selectedGameId: any) {
    const response = makeInteractiveGameEmbed(client, selectedGameId);

    if (!response) {
        sendGenericErrorReply(interaction);
        return;
    }

    interaction.update(response);
}