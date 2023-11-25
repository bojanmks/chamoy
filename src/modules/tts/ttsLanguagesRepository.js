const languages = require('../../assets/data/tts-languages.json');

module.exports = {
    get: () => {
        return languages.sort((a, b) => a.name.localeCompare(b.name));
    },
    find: (id) => {
        return languages.find(x => x.id === id);
    }
};