const sendReply = require("@modules/messaging/sendReply");

module.exports = (interaction, content, ephemeral = false) => {
    const replyContent = {
        content,
        ephemeral
    };

    sendReply(interaction, replyContent);
};