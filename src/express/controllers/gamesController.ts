import gamesRepository from "@modules/games/gamesRepository";

const get_games = {
    route: '/',
    method: 'get',
    callback : () => {
        const games = gamesRepository.get();
        return games;
    }
}

export default {
    get_games
};