import path from 'path';
import getObjectsFromFilesInPath from '@util/getObjectsFromFilesInPath';
import { Command } from '@models/commands/Command';

export default async (folders = ['commands']): Promise<Command[]> => {
    const commandsPath = path.join(__dirname, '..', '..', ...folders);
    const localCommands: Command[] = await getObjectsFromFilesInPath(commandsPath);

    return localCommands.filter((x: Command) => !x.deleted);
};