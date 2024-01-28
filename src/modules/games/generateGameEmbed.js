const gamesRepository = require('@modules/games/gamesRepository');
const generateBaseEmbed = require('@modules/embeds/generateBaseEmbed');

module.exports = (client, gameId) => {
    const game = gamesRepository.find(gameId);

    if (!game) {
        return null;
    }

    const embed = generateBaseEmbed(client, game.name);
    addLinksToEmbed(embed, game);

    return embed;
}

function addLinksToEmbed(embed, game) {
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