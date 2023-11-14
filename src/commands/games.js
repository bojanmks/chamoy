const { ApplicationCommandOptionType } = require('discord.js');
const gamesRepository = require('../modules/games/gamesRepository');
const sendGenericErrorReply = require('../modules/errors/messages/sendGenericErrorReply');
const generateBaseEmbed = require('../modules/embeds/generateBaseEmbed');
const generateCommandChoices = require('../modules/commands/generateCommandChoices');
const sendReply = require('../modules/messaging/sendReply');

module.exports = {
    name: 'games',
    description: 'Get game links',
    options: [
        {
            name: 'game',
            description: 'Name of the game',
            type: ApplicationCommandOptionType.Number,
            required: true,
            choices: generateCommandChoices(gamesRepository.get())
        },
        {
            name: 'ephemeral',
            description: 'Should message be only visible to you',
            type: ApplicationCommandOptionType.Boolean
        }
    ],
    callback: (client, interaction) => {
        const gameId = interaction.options.get('game').value;
        const game = gamesRepository.find(gameId);

        const ephemeral = interaction.options.get('ephemeral')?.value ?? false;

        if (!game) {
            return sendGenericErrorReply(interaction);
        }

        const embed = generateBaseEmbed(client, game.name);
        generateGameEmbed(embed, game);

        sendReply(interaction, {
            embeds: [embed],
            ephemeral: ephemeral
        });
    }
};

function generateGameEmbed(embed, game) {
    const activeLinks = game.links.filter(x => !x.deleted);
    for(let i in activeLinks) {
        addLinkToEmbed(embed, parseInt(i) + 1, game.links[i]);
    }

    if(game.thumbnail) {
        embed.setImage(game.thumbnail);
    }
}

function addLinkToEmbed(embed, ordinalNumber, linkObject) {
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