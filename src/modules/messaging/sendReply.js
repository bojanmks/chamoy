module.exports = (interaction, data) => {
    if (interaction.replied) {
        interaction.followUp(data);
        return;
    }

    interaction.reply(data);
};