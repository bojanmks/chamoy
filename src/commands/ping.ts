const sendTextReply = require("@modules/messaging/sendTextReply");
const { DEVELOPMENT_ENVIRONMENT } = require("@modules/shared/constants/environments");

module.exports = {
    name: 'ping',
    description: '🏓',
    environments: [DEVELOPMENT_ENVIRONMENT],
    callback: (client, interaction) => {
        sendTextReply(interaction, 'pong', true);
    }
};