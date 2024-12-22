import useCommandsRegistration from '@modules/commands/useCommandsRegistration';

const { registerCommands } = useCommandsRegistration();

export default async (client: any) => {
    try {
        await registerCommands(client);
    }
    catch (error) {
        console.error(`❌ There was an error registering commands:`);
        console.error(error);
    }
};