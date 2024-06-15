const sendTextReply = require("@modules/messaging/sendTextReply");
const { NO_PERMISSION_ERROR_RESPONSE } = require("@modules/errors/messages/errorMessages");

module.exports = (interaction) => {
    sendTextReply(interaction, NO_PERMISSION_ERROR_RESPONSE, true);
};