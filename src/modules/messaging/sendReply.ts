export default (interaction: any, data: any) => {
    if (interaction.deferred) {
        return interaction.editReply(data);
    }

    if (interaction.replied) {
        return interaction.followUp(data);
    }

    return interaction.reply(data);
};