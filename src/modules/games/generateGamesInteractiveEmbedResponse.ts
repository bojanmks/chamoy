import generateBaseEmbed from "@modules/embeds/generateBaseEmbed";
import gamesRepository from "@modules/games/gamesRepository";
import generateGameEmbed from "@modules/games/generateGameEmbed";
import generateRandomString from "@modules/shared/generateRandomString";
import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, MessagePayload, InteractionReplyOptions } from "discord.js";
import { GAMES_INTERACTIVE_DROPDOWN_ID_PREFIX, GAMES_INTERACTIVE_REFRESH_BUTTON_ID_PREFIX } from "./gamesConstants";

const REFRESH_BUTTON = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel('Refresh')
    .setEmoji('🔃');

export default (client: Client, selectedGameId = null): any => {
    let embed;

    if (selectedGameId) {
        embed = generateGameEmbed(client, selectedGameId);
    } else {
        embed = generateBaseEmbed(client, 'Select a game');

        embed.addFields({
            name: 'No game selected',
            value: 'Select a game to view its links'
        });
    }

    if (!embed) {
        return null;
    }

    const components = generateEmbedComponents(selectedGameId);

    return {
        embeds: [embed],
        components: components,
        ephemeral: false
    };
}

function generateEmbedComponents(selectedGameId: any) {
    const games = gamesRepository.get();

    const generatedActionRows = [];

    const dropdownActionRow = new ActionRowBuilder();

    const dropdown = new StringSelectMenuBuilder()
        .setCustomId(GAMES_INTERACTIVE_DROPDOWN_ID_PREFIX + generateRandomString())
        .setPlaceholder('Select a game');

    for (let game of games) {
        const selectOption = new StringSelectMenuOptionBuilder()
            .setLabel(game.name)
            .setValue(game.id.toString());

        if (selectedGameId && selectedGameId === game.id) {
            selectOption.setDefault(true);
        }

        dropdown.addOptions(selectOption);
    }

    dropdownActionRow.addComponents(dropdown);
    generatedActionRows.push(dropdownActionRow);

    if (selectedGameId) {
        REFRESH_BUTTON.setCustomId(`${GAMES_INTERACTIVE_REFRESH_BUTTON_ID_PREFIX + generateRandomString()}-${selectedGameId}`);

        const refreshButtonActionRow = new ActionRowBuilder();
        refreshButtonActionRow.addComponents(REFRESH_BUTTON);

        generatedActionRows.push(refreshButtonActionRow);
    }

    return generatedActionRows;
}