const gamesRepository = require("@modules/games/gamesRepository")

const get_games = {
    route: '/',
    method: 'get',
    callback : (req, res, next) => {
        const games = gamesRepository.get();
        return games;
    }
}

module.exports = {
    get_games
}