const { devs } = require('~/config.json');
const sendGenericErrorReply = require('@modules/errors/messages/sendGenericErrorReply');
const sendNoPermissionErrorReply = require('@modules/errors/messages/sendNoPermissionErrorReply');
const getLocalCommands = require('@modules/commands/getLocalCommands');
const sendTextReply = require('@modules/messaging/sendTextReply');

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;

    const localCommands = getLocalCommands(['commands']);
    const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

    if (!commandObject) {
        sendGenericErrorReply(interaction);
        return;
    }

    const foundUserReponse = commandObject.userResponses?.find(x => x.userId === interaction.user.id);
    if (foundUserReponse) {
        sendTextReply(interaction, foundUserReponse.response, true);
        return;
    }

    if (commandObject.onlyDevs) {
        if (!devs.includes(interaction.user.id)) {
            sendNoPermissionErrorReply(interaction);
            return;
        }
    }

    try {
        await commandObject.callback(client, interaction);
    } catch (e) {
        console.error(`❌ There was an error running the ${commandObject.name} command:`);
        console.error(e);

        if (!e.name.includes("ConnectTimeoutError")) {
            sendGenericErrorReply(interaction);
        }
    }
};