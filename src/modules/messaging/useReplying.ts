import { CommandInteraction, MessagePayload, InteractionReplyOptions } from "discord.js";

const sendReply = (interaction: CommandInteraction, data: string | MessagePayload | InteractionReplyOptions) => {
    if (interaction.deferred) {
        return interaction.editReply(data);
    }
    
    if (interaction.replied) {
        return interaction.followUp(data);
    }

    return interaction.reply(data);
}

const sendTextReply = (interaction: CommandInteraction, content: string, ephemeral = false) => {
    const replyContent = {
        content,
        ephemeral
    };

    return sendReply(interaction, replyContent);
}

export default () => {
    return {
        sendReply,
        sendTextReply
    }
}