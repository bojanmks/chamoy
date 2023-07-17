const sendTextReply = require("../../messaging/sendTextReply");
const { GENERIC_ERROR_RESPONSE } = require("./errorMessages");

module.exports = (interaction) => {
    sendTextReply(interaction, GENERIC_ERROR_RESPONSE, true);
};