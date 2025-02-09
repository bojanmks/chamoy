import { Client } from 'discord.js';
import { registerCommands } from '@modules/commands/commandRegistration';

export default async (client: Client) => {
    try {
        await registerCommands(client);
    }
    catch (error) {
        console.error(`❌ There was an error registering commands:`);
        console.error(error);
    }
};