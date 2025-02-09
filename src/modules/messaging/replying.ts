import { CommandInteraction, InteractionReplyOptions, MessagePayload } from "discord.js";

export const sendReply = (interaction: CommandInteraction, data: string | MessagePayload | InteractionReplyOptions) => {
    if (interaction.deferred) {
        return interaction.editReply(data);
    }
    
    if (interaction.replied) {
        return interaction.followUp(data);
    }

    return interaction.reply(data);
}

export const sendTextReply = (interaction: CommandInteraction, content: string) => {
    const replyContent = {
        content
    };

    return sendReply(interaction, replyContent);
}