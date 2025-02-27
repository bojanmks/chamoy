import { GAMES_INTERACTIVE_DROPDOWN_ID_PREFIX, GAMES_INTERACTIVE_REFRESH_BUTTON_ID_PREFIX } from "@modules/games/constants/gameConstants";

import { Client } from "discord.js";
import { makeInteractiveGameEmbed } from "@modules/games/gameEmbeds";
import { sendGenericErrorReply } from "@modules/errors/errorReplying";

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
    const response = await makeInteractiveGameEmbed(client, selectedGameId);

    if (!response) {
        await sendGenericErrorReply(interaction);
        return;
    }

    interaction.update(response);
}