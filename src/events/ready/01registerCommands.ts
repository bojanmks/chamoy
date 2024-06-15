import areCommandsDifferent from '@modules/commands/areCommandsDifferent';
import getApplicationCommands from '@modules/commands/getApplicationCommands';
import getLocalCommands from '@modules/commands/getLocalCommands';
import { CURRENT_ENVIRONMENT } from '@modules/shared/constants/environments';

export default async (client: any) => {
    try {
        const localCommands = await getLocalCommands(['commands']);
        const applicationCommands = await getApplicationCommands(client);

        await updateApplicationCommands(localCommands, applicationCommands);
        await removeNonExistantCommands(localCommands, applicationCommands);
    } catch (error) {
        console.error(`❌ There was an error registering commands:`);
        console.error(error);
    }
};

async function updateApplicationCommands(localCommands: any, applicationCommands: any) {
    for (const localCommand of localCommands) {
        const existingCommand = await applicationCommands.cache.find(
            (x: any) => x.name === localCommand.name && x.type === localCommand.type
        );

        if (existingCommand) {
            if (localCommand.environments && !localCommand.environments.includes(CURRENT_ENVIRONMENT)) {
                await deleteExistingCommand(applicationCommands, existingCommand.id);
                console.log(`✅ Command deleted: ${localCommand.name}`);
                continue;
            }

            if (localCommand.deleted) {
                await deleteExistingCommand(applicationCommands, existingCommand.id);
                console.log(`✅ Command deleted: ${localCommand.name}`);
                continue;
            }

            if (areCommandsDifferent(existingCommand, localCommand)) {
                await updateExistingCommand(applicationCommands, existingCommand.id, localCommand);
                console.log(`✅ Command updated: ${localCommand.name}`);
                continue;
            }

            console.log(`✅ Command exists: ${localCommand.name}`);
            continue;
        }

        if (!localCommand.environments || localCommand.environments.includes(CURRENT_ENVIRONMENT)) {
            await createNewCommand(applicationCommands, localCommand);
            console.log(`✅ Command registered: ${localCommand.name}`);
        }
    }
}

async function removeNonExistantCommands(localCommands: any, applicationCommands: any) {
    const commandsToBeDeleted = await applicationCommands.cache.filter(
        (x: any) => !localCommands.some((y: any) => y.name === x.name)
    );

    for (const commandToBeDeleted of commandsToBeDeleted.values()) {
        await deleteExistingCommand(applicationCommands, commandToBeDeleted.id);
        console.log(`✅ Command deleted: ${commandToBeDeleted.name}`);
    }
}

async function createNewCommand(applicationCommands: any, newCommand: any) {
    await applicationCommands.create({
        name: newCommand.name,
        description: newCommand.description,
        options: newCommand.options,
        type: newCommand.type
    });
}

async function updateExistingCommand(applicationCommands: any, id: any, updatedCommand: any) {
    await applicationCommands.edit(id, {
        description: updatedCommand.description,
        options: updatedCommand.options ?? []
    });
}

async function deleteExistingCommand(applicationCommands: any, id: any) {
    await applicationCommands.delete(id);
}