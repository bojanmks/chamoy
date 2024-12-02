import useErrorReplying from "@modules/errors/useErrorReplying";
import useGameEmbeds from "@modules/games/useGameEmbeds";
import useGamesConstants from "@modules/games/useGamesConstants";
import { Client } from "discord.js";

const { sendGenericErrorReply } = useErrorReplying();
const { GAMES_INTERACTIVE_DROPDOWN_ID_PREFIX, GAMES_INTERACTIVE_REFRESH_BUTTON_ID_PREFIX } = useGamesConstants();
const { makeInteractiveGameEmbed } = useGameEmbeds();

export default async (client: Client, interaction: any) => {
    if (interaction.customId?.startsWith(GAMES_INTERACTIVE_DROPDOWN_ID_PREFIX)) {
        const selectedGameId = parseInt(interaction.values[0]);
        await handleGameSelect(client, interaction, selectedGameId);
        return;
    }
    
    if (interaction.customId?.startsWith(GAMES_INTERACTIVE_REFRESH_BUTTON_ID_PREFIX)) {
        const selectedGameId = parseInt(interaction.customId.split('-')[1]);
        await handleGameSelect(client, interaction, selectedGameId);
        return;
    }
}

const handleGameSelect = async (client: Client, interaction: any, selectedGameId: any) => {
    const response = makeInteractiveGameEmbed(client, selectedGameId);

    if (!response) {
        await sendGenericErrorReply(interaction);
        return;
    }

    interaction.update(response);
}