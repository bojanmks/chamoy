const audioList = require('@assets/data/audio.json');

module.exports = {
    get: () => {
        return audioList.sort((a, b) => a.name.localeCompare(b.name));
    },
    find: (id) => {
        return audioList.find(x => x.id === id);
    }
};