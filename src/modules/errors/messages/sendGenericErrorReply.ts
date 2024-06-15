const sendTextReply = require("@modules/messaging/sendTextReply");
const { GENERIC_ERROR_RESPONSE } = require("@modules/errors/messages/errorMessages");

module.exports = (interaction) => {
    sendTextReply(interaction, GENERIC_ERROR_RESPONSE, true);
};