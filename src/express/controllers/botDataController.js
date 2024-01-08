const { default: axios } = require("axios");

const get_data = {
    route: '/',
    method: 'get',
    callback : async (req, res, next, client) => {
        const botActivity = client.presence?.activities?.length
            ? client.presence.activities[0]
            : null;

        return {
            name: client.user.username,
            avatar: await imagePathToBase64(client.user.displayAvatarURL()),
            presence: botActivity
                ? { name: botActivity.name, type: botActivity.type }
                : null
        };
    }
}

const imagePathToBase64 = async (imagePath) => {
    const response = await axios.get(imagePath, { responseType: 'arraybuffer' });
    return Buffer.from(response.data).toString('base64');
}

module.exports = {
    get_data
}