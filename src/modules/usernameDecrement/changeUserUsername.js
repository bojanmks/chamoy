const { targetUserId, serverId } = require('../../../config.json');

module.exports = async (username, client) => {
    const server = await client.guilds.fetch(serverId);
    if (!server) return false;
    
    const targetUser = await server.members.fetch(targetUserId);
    if (!targetUser) return false;

    targetUser.setNickname(username);

    return true;
};