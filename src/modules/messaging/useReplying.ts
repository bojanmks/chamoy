import { CommandInteraction, InteractionReplyOptions, MessagePayload } from "discord.js";

const sendReply = (interaction: CommandInteraction, data: string | MessagePayload | InteractionReplyOptions) => {
    if (interaction.deferred) {
        return interaction.editReply(data);
    }
    
    if (interaction.replied) {
        return interaction.followUp(data);
    }

    return interaction.reply(data);
}

const sendTextReply = (interaction: CommandInteraction, content: string) => {
    const replyContent = {
        content
    };

    return sendReply(interaction, replyContent);
}

export default () => {
    return {
        sendReply,
        sendTextReply
    }
}