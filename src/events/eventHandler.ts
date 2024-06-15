import path from 'path';
import getAllFiles from '@util/getAllFiles';

export default (client: any) => {
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

        client.on(eventName, async (arg: any) => {
            for (const eventFile of eventFiles) {
                const eventFunction = (await import(eventFile)).default;
                await eventFunction(client, arg);
            }
        })
    }
};