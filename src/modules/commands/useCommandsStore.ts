import path from 'path';
import getObjectsFromFilesInPath from '@util/getObjectsFromFilesInPath';
import { Client, ApplicationCommandManager, ApplicationCommand, GuildResolvable } from 'discord.js';
import { Command } from './useCommands';

const getLocalCommands = async (folders = ['commands']): Promise<Command[]> => {
    const commandsPath = path.join(__dirname, '..', '..', ...folders);
    const localCommands: Command[] = await getObjectsFromFilesInPath(commandsPath);

    return localCommands.filter((x: Command) => !x.deleted);
}

const getApplicationCommands = async (client: Client): Promise<ApplicationCommandManager<ApplicationCommand<{guild: GuildResolvable}>, {guild: GuildResolvable}, null> | undefined> => {
    let applicationCommands = await client.application?.commands;
    await applicationCommands?.fetch();
    
    return applicationCommands;
}

export default () => {
    return {
        getLocalCommands,
        getApplicationCommands
    }
}