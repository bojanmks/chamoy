const path = require('path');
const getObjectsFromFilesInPath = require('@util/getObjectsFromFilesInPath');

module.exports = () => {
    const commandsPath = path.join(__dirname, '..', '..', 'commands');
    const localCommands = getObjectsFromFilesInPath(commandsPath);
    
    return localCommands.filter(x => !x.deleted);
};