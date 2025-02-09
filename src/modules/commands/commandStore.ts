import { ApplicationCommand, ApplicationCommandManager, Client, GuildResolvable } from 'discord.js';

import { ICommand } from './models/ICommand';
import { getObjectsFromFilesInPath } from '@modules/files/files';
import path from 'path';

export const getLocalCommands = async (): Promise<ICommand[]> => {
    const commandsPath = path.join(__dirname, '..', '..', 'commands');
    const localCommands: ICommand[] = await getObjectsFromFilesInPath(commandsPath);

    return localCommands.filter((x: ICommand) => !x.deleted);
}

export const getApplicationCommands = async (client: Client): Promise<ApplicationCommandManager<ApplicationCommand<{guild: GuildResolvable}>, {guild: GuildResolvable}, null> | undefined> => {
    let applicationCommands = await client.application?.commands;
    await applicationCommands?.fetch();
    
    return applicationCommands;
}