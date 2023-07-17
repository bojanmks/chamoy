const sendTextReply = require("../../messaging/sendTextReply");
const { NO_PERMISSION_ERROR_RESPONSE } = require("./errorMessages");

module.exports = (interaction) => {
    sendTextReply(interaction, NO_PERMISSION_ERROR_RESPONSE, true);
};