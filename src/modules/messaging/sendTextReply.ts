import sendReply from "@modules/messaging/sendReply";
import { CommandInteraction } from "discord.js";

export default (interaction: CommandInteraction, content: string, ephemeral = false) => {
    const replyContent = {
        content,
        ephemeral
    };

    sendReply(interaction, replyContent);
};