const path = require('path');
const getObjectsFromFilesInPath = require('@util/getObjectsFromFilesInPath');
const { ApplicationCommandType } = require('discord.js');

module.exports = (folders = ['commands']) => {
    const commandsPath = path.join(__dirname, '..', '..', ...folders);
    const localCommands = getObjectsFromFilesInPath(commandsPath);
    
    localCommands.forEach(c => c.type ??= ApplicationCommandType.ChatInput);

    return localCommands.filter(x => !x.deleted);
};