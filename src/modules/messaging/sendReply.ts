import { CommandInteraction, InteractionEditReplyOptions, InteractionReplyOptions, MessagePayload } from "discord.js";

export default (interaction: CommandInteraction, data: string | MessagePayload | InteractionReplyOptions) => {
    if (interaction.deferred) {
        return interaction.editReply(data);
    }

    if (interaction.replied) {
        return interaction.followUp(data);
    }

    return interaction.reply(data);
};