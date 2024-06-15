import sendReply from "@modules/messaging/sendReply";

export default (interaction: any, content: any, ephemeral = false) => {
    const replyContent = {
        content,
        ephemeral
    };

    sendReply(interaction, replyContent);
};