const sendTextReply = require("../../messaging/sendTextReply");

module.exports = (daysLeft, interaction) => {
    sendTextReply(interaction, `${daysLeft} days left`, true);
};