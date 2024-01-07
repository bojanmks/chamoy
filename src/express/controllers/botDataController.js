const get_data = {
    route: '/',
    method: 'get',
    callback : (req, res, next, client) => {
        return {
            name: client.user.username,
            avatar: client.user.displayAvatarURL()
        };
    }
}

module.exports = {
    get_data
}