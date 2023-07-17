const { NO_PERMISSION_ERROR_RESPONSE } = require("./errorMessages");

module.exports = (interaction) => {
    interaction.reply({
        content: NO_PERMISSION_ERROR_RESPONSE,
        ephemeral: true
    });
};