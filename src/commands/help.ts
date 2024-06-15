import handleHelpResponse from "@modules/help/handleHelpResponse";

export default {
    name: 'help',
    description: 'Lists all commands',
    callback: async (client: any, interaction: any) => {
        await handleHelpResponse(client, interaction, interaction.user.id);
    }
};