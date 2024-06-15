const sendTextReply = require("@modules/messaging/sendTextReply");
const { BOT_IS_BUSY_ERROR_RESPONSE } = require("@modules/errors/messages/errorMessages");

module.exports = (interaction) => {
    sendTextReply(interaction, BOT_IS_BUSY_ERROR_RESPONSE, true);
};