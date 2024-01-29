const areCommandsDifferent = require('@modules/commands/areCommandsDifferent');
const getApplicationCommands = require('@modules/commands/getApplicationCommands');
const getLocalCommands = require('@modules/commands/getLocalCommands');
const { CURRENT_ENVIRONMENT } = require('@modules/shared/constants/environments');

module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client);

        await updateApplicationCommands(localCommands, applicationCommands);
        await removeNonExistantCommands(localCommands, applicationCommands);
    } catch (error) {
        console.error(`❌ There was an error registering commands:`);
        console.error(error);
    }
};

async function updateApplicationCommands(localCommands, applicationCommands) {
    for (const localCommand of localCommands) {
        const existingCommand = await applicationCommands.cache.find(
            x => x.name === localCommand.name
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

async function removeNonExistantCommands(localCommands, applicationCommands) {
    const commandsToBeDeleted = await applicationCommands.cache.filter(
        x => !localCommands.some(y => y.name === x.name)
    );

    for (const commandToBeDeleted of commandsToBeDeleted.values()) {
        await deleteExistingCommand(applicationCommands, commandToBeDeleted.id);
        console.log(`✅ Command deleted: ${commandToBeDeleted.name}`);
    }
}

async function createNewCommand(applicationCommands, newCommand) {
    await applicationCommands.create({
        name: newCommand.name,
        description: newCommand.description,
        options: newCommand.options
    });
}

async function updateExistingCommand(applicationCommands, id, updatedCommand) {
    await applicationCommands.edit(id, {
        description: updatedCommand.description,
        options: updatedCommand.options ?? []
    });
}

async function deleteExistingCommand(applicationCommands, id) {
    await applicationCommands.delete(id);
}