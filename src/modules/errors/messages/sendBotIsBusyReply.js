const sendTextReply = require("../../messaging/sendTextReply");
const { BOT_IS_BUSY_ERROR_RESPONSE } = require("./errorMessages");

module.exports = (interaction) => {
    sendTextReply(interaction, BOT_IS_BUSY_ERROR_RESPONSE, true);
};