import path from 'path';
import getObjectsFromFilesInPath from '@util/getObjectsFromFilesInPath';
import { ApplicationCommandType } from 'discord.js';

export default async (folders = ['commands']) => {
    const commandsPath = path.join(__dirname, '..', '..', ...folders);
    const localCommands = await getObjectsFromFilesInPath(commandsPath);
    
    localCommands.forEach((c: any) => c.type ??= ApplicationCommandType.ChatInput);

    return localCommands.filter((x: any) => !x.deleted);
};