const { GENERIC_ERROR_RESPONSE } = require("../constants/responseMessages");

module.exports = (interaction) => {
    interaction.reply({
        content: GENERIC_ERROR_RESPONSE,
        ephemeral: true
    });
};