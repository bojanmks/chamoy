const games = require('../../data/games.json');

module.exports = {
    get: () => {
        return games.sort((a, b) => a.keyword.localeCompare(b.keyword));
    },
    find: (keyword) => {
        return games.find(x => x.keyword === keyword);
    }
};