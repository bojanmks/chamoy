const { targetUserId, serverId } = require('../../../config.json');

module.exports = async (username, client) => {
    let server = null;
    await client.guilds.fetch(serverId)
        .then(async data => server = data)
        .catch(error => handleError(error));

    if (!server) return false;
    
    let targerUser = null;
    await server.members.fetch(targetUserId)
        .then(data => targerUser = data)
        .catch(error => handleError(error));

    if (!targerUser) return false;

    targetUser.setNickname(username);

    return true;
};

function handleError(error) {
    console.error(`An error occured: ${error}`);
}