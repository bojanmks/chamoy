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
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: generateCommandChoices(gamesRepository.get())
        }
    ],
    callback: (client, interaction) => {
        const gameKeyword = interaction.options.get('game').value;
        const game = gamesRepository.find(gameKeyword);

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
    return games.map(x => ({
        name: x.name,
        value: x.keyword
    }));
}

function generateGameEmbed(game) {
    const embed = generateBaseEmbed();

    embed.setTitle('Linkovi:');

    for(let i in game.links) {
        embed.addFields({
            name: '\u200b',
            value: "``" + (parseInt(i) + 1) + ".``  " + `[${game.links[i].name}](${game.links[i].link})`,
            inline: false
        });
    }

    if(game.thumbnail) {
        embed.setImage(game.thumbnail);
    }

    return embed;
}