const get_data = {
    route: '/',
    method: 'get',
    callback : (req, res, next, client) => {
        const botActivity = client.presence?.activities?.length
            ? client.presence.activities[0]
            : null;

        return {
            name: client.user.username,
            avatar: client.user.displayAvatarURL(),
            presence: botActivity
                ? { name: botActivity.name, type: botActivity.type }
                : null
        };
    }
}

module.exports = {
    get_data
}