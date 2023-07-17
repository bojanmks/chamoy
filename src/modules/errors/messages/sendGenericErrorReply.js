const { GENERIC_ERROR_RESPONSE } = require("./errorMessages");

module.exports = (interaction) => {
    interaction.reply({
        content: GENERIC_ERROR_RESPONSE,
        ephemeral: true
    });
};