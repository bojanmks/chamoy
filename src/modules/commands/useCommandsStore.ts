import path from 'path';
import { Client, ApplicationCommandManager, ApplicationCommand, GuildResolvable } from 'discord.js';
import useFiles from '@modules/files/useFiles';
import { ICommand } from './models/ICommand';

const { getObjectsFromFilesInPath } = useFiles();

const getLocalCommands = async (): Promise<ICommand[]> => {
    const commandsPath = path.join(__dirname, '..', '..', 'commands');
    const localCommands: ICommand[] = await getObjectsFromFilesInPath(commandsPath);

    return localCommands.filter((x: ICommand) => !x.deleted);
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