const sendTextReply = require("@modules/messaging/sendTextReply");

module.exports = (daysLeft, interaction) => {
    sendTextReply(interaction, `${daysLeft} days left`, true);
};