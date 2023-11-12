module.exports = (interaction, data) => {
    if (interaction.replied) {
        return interaction.followUp(data);
    }

    return interaction.reply(data);
};