const gamesRepository = require("@modules/games/gamesRepository")

const get_games = {
    route: '/',
    method: 'get',
    callback : () => {
        const games = gamesRepository.get();
        return games;
    }
}

module.exports = {
    get_games
}