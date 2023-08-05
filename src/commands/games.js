const { ApplicationCommandOptionType } = require('discord.js');
const gamesRepository = require('../modules/games/gamesRepository');
const sendGenericErrorReply = require('../modules/errors/messages/sendGenericErrorReply');
const generateBaseEmbed = require('../modules/embeds/generateBaseEmbed');

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
        }
    ],
    callback: (client, interaction) => {
        const gameId = interaction.options.get('game').value;
        const game = gamesRepository.find(gameId);

        if (!game) {
            return sendGenericErrorReply(interaction);
        }

        const embed = generateGameEmbed(game);

        interaction.reply({
            embeds: [embed]
        });
    }
};

function generateCommandChoices(games) {
    return games.filter(x => !x.deleted).map(x => ({
        name: x.name,
        value: x.id
    }));
}

function generateGameEmbed(game) {
    const embed = generateBaseEmbed();

    embed.setTitle(game.name);

    for(let i in game.links) {
        addLinkToEmbed(embed, parseInt(i) + 1, game.links[i]);
    }

    if(game.thumbnail) {
        embed.setImage(game.thumbnail);
    }

    return embed;
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