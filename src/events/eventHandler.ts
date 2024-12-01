import path from 'path';
import getAllFiles from '@util/getAllFiles';
import { Client } from 'discord.js';

export default (client: Client) => {
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort((a: any, b: any) => {
            if (a > b) {
                return 1;
            }

            if (a < b) {
                return -1;
            }

            return 0;
        });
        
        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();

        client.on(eventName!, async (arg1: any, arg2: any) => {
            for (const eventFile of eventFiles) {
                const eventFunction = (await import(eventFile)).default;

                try {
                    await eventFunction(client, arg1, arg2);
                } catch (error) {
                    console.error(`❌ There was an handling the the ${eventFile} event: ${error}`);
                }
            }
        })
    }
};