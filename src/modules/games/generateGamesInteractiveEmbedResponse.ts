const generateBaseEmbed = require("@modules/embeds/generateBaseEmbed");
const gamesRepository = require("@modules/games/gamesRepository");
const generateGameEmbed = require("@modules/games/generateGameEmbed");
const generateRandomString = require("@modules/shared/generateRandomString");
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { GAMES_INTERACTIVE_DROPDOWN_ID_PREFIX, GAMES_INTERACTIVE_REFRESH_BUTTON_ID_PREFIX } = require("./gamesConstants");

const REFRESH_BUTTON = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel('Refresh')
    .setEmoji('🔃');

module.exports = (client, selectedGameId = null) => {
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

function generateEmbedComponents(selectedGameId) {
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