module.exports = (interaction, data) => {
    if (interaction.deferred) {
        return interaction.editReply(data);
    }

    if (interaction.replied) {
        return interaction.followUp(data);
    }

    return interaction.reply(data);
};