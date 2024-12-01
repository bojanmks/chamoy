import games from '@data/games.json';

const getGames = () => {
    return games.filter((x: any) => !x.deleted).sort((a: any, b: any) => a.name.localeCompare(b.name));
}

const findGame = (id: any) => {
    return games.find((x: any) => x.id === id);
}

export default () => {
    return {
        getGames,
        findGame
    }
}