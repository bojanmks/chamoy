import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { GAMES_INTERACTIVE_DROPDOWN_ID_PREFIX, GAMES_INTERACTIVE_REFRESH_BUTTON_ID_PREFIX } from "./constants/gameConstants";

import { Game } from "./models/Game";
import { gamesRepository } from "@database/repositories/repositories";
import { makeBaseEmbed } from "@modules/embeds/embeds";
import { randomString } from "@modules/shared/strings";

export const makeGameEmbed = async (client: Client, gameId: number) => {
    const game = (await gamesRepository.find(gameId, { include: { gameLinks: true } }));

    if (!game) {
        return null;
    }

    const embed = makeBaseEmbed(client, game.name);
    addLinksToEmbed(embed, game);

    return embed;
}

const addLinksToEmbed = (embed: any, game: Game) => {
    const activeLinks = game.gameLinks!.sort((a, b) => a.id - b.id).filter((x: any) => !x.deleted);
    for(let i in activeLinks) {
        addLinkToEmbed(embed, parseInt(i) + 1, game.gameLinks![i]);
    }

    if(game.thumbnail) {
        embed.setImage(game.thumbnail);
    }
}

const addLinkToEmbed = (embed: any, ordinalNumber: any, linkObject: any) => {
    let fieldValue = "``" + ordinalNumber + ".``  " + `[${linkObject.name}](${linkObject.link})`;

    if (linkObject.description) {
        fieldValue += ` - ${linkObject.description}`;
    }

    embed.addFields({
        name: '\u200b',
        value: fieldValue,
        inline: false
    });
}

const REFRESH_BUTTON = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel('Refresh')
    .setEmoji('🔃');

export const makeInteractiveGameEmbed = async (client: Client, selectedGameId: number | null = null): Promise<any> => {
    let embed;

    if (selectedGameId) {
        embed = await makeGameEmbed(client, selectedGameId);
    } else {
        embed = makeBaseEmbed(client, 'Select a game');

        embed.addFields({
            name: 'No game selected',
            value: 'Select a game to view its links'
        });
    }

    if (!embed) {
        return null;
    }

    const components = await makeInteractiveEmbedComponents(selectedGameId);

    return {
        embeds: [embed],
        components: components
    };
}

const makeInteractiveEmbedComponents = async (selectedGameId: any) => {
    const games = (await gamesRepository.getAll()).sort((a, b) => a.id - b.id);

    const generatedActionRows = [];

    const dropdownActionRow = new ActionRowBuilder();

    const dropdown = new StringSelectMenuBuilder()
        .setCustomId(GAMES_INTERACTIVE_DROPDOWN_ID_PREFIX + randomString())
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
        REFRESH_BUTTON.setCustomId(`${GAMES_INTERACTIVE_REFRESH_BUTTON_ID_PREFIX + randomString()}-${selectedGameId}`);

        const refreshButtonActionRow = new ActionRowBuilder();
        refreshButtonActionRow.addComponents(REFRESH_BUTTON);

        generatedActionRows.push(refreshButtonActionRow);
    }

    return generatedActionRows;
}