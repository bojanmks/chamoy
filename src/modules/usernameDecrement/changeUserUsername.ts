import { targetUserId, serverId } from '../../../config.json';

export default async (username: any, client: any) => {
    const server = await client.guilds.fetch(serverId);
    if (!server) return false;
    
    const targetUser = await server.members.fetch(targetUserId);
    if (!targetUser) return false;

    let result = true;

    await targetUser.setNickname(username).catch((err: any) => {
        result = false;
        console.error(`❌ There was an error setting a users nickname:`);
        console.error(err);
    });

    return result;
};