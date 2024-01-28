const handleHelpResponse = require("@modules/help/handleHelpResponse");

module.exports = {
    name: 'help',
    description: 'Lists all commands',
    callback: async (client, interaction) => {
        await handleHelpResponse(client, interaction, interaction.user.id);
    }
};