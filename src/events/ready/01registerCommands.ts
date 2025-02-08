import { Client } from 'discord.js';
import useCommandsRegistration from '@modules/commands/useCommandsRegistration';

const { registerCommands } = useCommandsRegistration();

export default async (client: Client) => {
    try {
        await registerCommands(client);
    }
    catch (error) {
        console.error(`❌ There was an error registering commands:`);
        console.error(error);
    }
};