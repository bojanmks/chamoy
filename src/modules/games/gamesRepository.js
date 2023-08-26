const games = require('../../assets/data/games.json');

module.exports = {
    get: () => {
        return games.sort((a, b) => a.name.localeCompare(b.name));
    },
    find: (id) => {
        return games.find(x => x.id === id);
    }
};