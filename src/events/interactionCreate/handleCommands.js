const { devs } = require('../../../config.json');
const sendGenericErrorReply = require('../../errors/sendGenericErrorReply');
const sendNoPermissionErrorReply = require('../../errors/sendNoPermissionErrorReply');
const getLocalCommands = require('../../modules/commands/getLocalCommands');

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
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

        await commandObject.callback(client, interaction);
    } catch (error) {
        sendGenericErrorReply(interaction);
        console.error(`❌ There was an error running a command: ${error}`);
    }
};