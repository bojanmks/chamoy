import { ApplicationCommand, ApplicationCommandManager, Client, GuildResolvable } from 'discord.js';

import { ICommand } from './models/ICommand';
import { IEntity } from '@database/models/IEntity';
import useCommandsComparison from '@modules/commands/useCommandsComparison';
import useCommandsStore from '@modules/commands/useCommandsStore';
import useEnvironments from '@modules/environments/useEnvironments';

const { CURRENT_ENVIRONMENT } = useEnvironments();
const { getLocalCommands, getApplicationCommands } = useCommandsStore();
const { areCommandsDifferent } = useCommandsComparison();

const registerCommands = async (client: Client) => {
    const localCommands = await getLocalCommands();
    const applicationCommands = await getApplicationCommands(client);

    await updateApplicationCommands(localCommands, applicationCommands);
    await removeNonExistantCommands(localCommands, applicationCommands);
}

const updateApplicationCommands = async (
    localCommands: ICommand[],
    applicationCommands: ApplicationCommandManager<ApplicationCommand<{guild: GuildResolvable}>, {guild: GuildResolvable}, null> | undefined
) => {
    for (const localCommand of localCommands) {
        const existingCommand = await applicationCommands?.cache.find(
            (x: any) => x.name === localCommand.name && x.type === localCommand.type
        );

        if (existingCommand) {
            if (localCommand.environments && !localCommand.environments.includes(CURRENT_ENVIRONMENT!)) {
                await deleteExistingCommand(applicationCommands, existingCommand.id);
                console.log(`✅ Command deleted: ${localCommand.name}`);
                continue;
            }

            if (localCommand.deleted) {
                await deleteExistingCommand(applicationCommands, existingCommand.id);
                console.log(`✅ Command deleted: ${localCommand.name}`);
                continue;
            }

            if (localCommand.computedOptions.some(x => x.choicesRepositoryOptions) || areCommandsDifferent(existingCommand, localCommand)) {
                await updateExistingCommand(applicationCommands, existingCommand.id, localCommand);
                console.log(`✅ Command updated: ${localCommand.name}`);
                continue;
            }

            console.log(`✅ Command exists: ${localCommand.name}`);
            continue;
        }

        if (!localCommand.environments || localCommand.environments.includes(CURRENT_ENVIRONMENT!)) {
            await createNewCommand(applicationCommands, localCommand);
            console.log(`✅ Command registered: ${localCommand.name}`);
        }
    }
}

const removeNonExistantCommands = async (
    localCommands: ICommand[],
    applicationCommands: ApplicationCommandManager<ApplicationCommand<{guild: GuildResolvable}>, {guild: GuildResolvable}, null> | undefined
) => {
    const commandsToBeDeleted = await applicationCommands?.cache.filter(
        (x: any) => !localCommands.some((y: any) => y.name === x.name)
    );

    for (const commandToBeDeleted of (commandsToBeDeleted?.values() || [])) {
        await deleteExistingCommand(applicationCommands, commandToBeDeleted.id);
        console.log(`✅ Command deleted: ${commandToBeDeleted.name}`);
    }
}

const createNewCommand = async (applicationCommands: any, newCommand: ICommand) => {
    const commandOptions = await loadCommandOptionsWithParameters(newCommand);

    await applicationCommands.create({
        name: newCommand.name,
        description: newCommand.description,
        options: commandOptions,
        type: newCommand.type
    });
}

const loadCommandOptionsWithParameters = async (command: ICommand) => {
    const commandOptions = command.computedOptions || [];

    for (let co of commandOptions) {
        if (!co.choicesRepositoryOptions) {
            continue;
        }

        co.choices = (await co.choicesRepositoryOptions.repository.getAll()).sort((a: IEntity, b: IEntity) => a.id - b.id).map(x => ({
            name: co.choicesRepositoryOptions!.choiceNameGetter(x),
            value: co.choicesRepositoryOptions!.choiceValueGetter(x)
        }));
    }

    return commandOptions;
}

const updateExistingCommand = async (applicationCommands: any, id: any, updatedCommand: any) => {
    const commandOptions = await loadCommandOptionsWithParameters(updatedCommand);

    await applicationCommands.edit(id, {
        description: updatedCommand.description,
        options: commandOptions
    });
}

const deleteExistingCommand = async (applicationCommands: any, id: any) => {
    await applicationCommands.delete(id);
}

export default () => {
    return {
        registerCommands
    }
}