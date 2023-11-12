const { devs } = require('../../../config.json');
const sendGenericErrorReply = require('../../modules/errors/messages/sendGenericErrorReply');
const sendNoPermissionErrorReply = require('../../modules/errors/messages/sendNoPermissionErrorReply');
const getLocalCommands = require('../../modules/commands/getLocalCommands');

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();
    const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

    if (!commandObject) {
        sendGenericErrorReply(interaction);
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
    } catch (error) {
        console.error(`❌ There was an error running the ${commandObject.name} command:`);
        console.error(error);

        // so the bot doesn't crash when it's not able to send a reply due to the connection timeout exception
        try {
            sendGenericErrorReply(interaction);
        } catch {
            //
        }
    }
};