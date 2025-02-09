import { Client } from 'discord.js';
import { getContentsOfDirectory } from '@modules/files/files';
import path from 'path';

export default async (client: Client) => {
    const eventFolders = getContentsOfDirectory(path.join(__dirname, '..', 'events'), true);

    for (const eventFolder of eventFolders) {
        const eventFiles = getContentsOfDirectory(eventFolder);
        eventFiles.sort((a: any, b: any) => {
            if (a > b) {
                return 1;
            }

            if (a < b) {
                return -1;
            }

            return 0;
        });
        
        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop() as string;
        const loadedEventFunctions: { eventName: string, eventFunction: Function }[] = [];

        for (const eventFile of eventFiles) {
            const eventFunction = (await import(eventFile)).default;
            loadedEventFunctions.push({
                eventName,
                eventFunction
            });
        }

        client.on(eventName!, async (arg1: any, arg2: any) => {
            for (const el of loadedEventFunctions) {
                try {
                    await el.eventFunction(client, arg1, arg2);
                } catch (error) {
                    console.error(`❌ There was an handling the the ${el.eventName} event.`);
                    console.error(error);
                }
            }
        })
    }
};