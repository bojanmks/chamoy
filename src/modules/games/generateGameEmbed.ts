import gamesRepository from '@modules/games/gamesRepository';
import generateBaseEmbed from '@modules/embeds/generateBaseEmbed';

export default (client: any, gameId: any) => {
    const game = gamesRepository.find(gameId);

    if (!game) {
        return null;
    }

    const embed = generateBaseEmbed(client, game.name);
    addLinksToEmbed(embed, game);

    return embed;
}

function addLinksToEmbed(embed: any, game: any) {
    const activeLinks = game.links.filter((x: any) => !x.deleted);
    for(let i in activeLinks) {
        addLinkToEmbed(embed, parseInt(i) + 1, game.links[i]);
    }

    if(game.thumbnail) {
        embed.setImage(game.thumbnail);
    }
}

function addLinkToEmbed(embed: any, ordinalNumber: any, linkObject: any) {
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