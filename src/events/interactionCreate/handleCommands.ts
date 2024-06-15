import { devs } from '../../../config.json';
import sendGenericErrorReply from '@modules/errors/messages/sendGenericErrorReply';
import sendNoPermissionErrorReply from '@modules/errors/messages/sendNoPermissionErrorReply';
import getLocalCommands from '@modules/commands/getLocalCommands';
import sendTextReply from '@modules/messaging/sendTextReply';

export default async (client: any, interaction: any) => {
    if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;

    const localCommands = await getLocalCommands(['commands']);
    const commandObject = localCommands.find((cmd: any) => cmd.name === interaction.commandName);

    if (!commandObject) {
        sendGenericErrorReply(interaction);
        return;
    }

    const foundUserReponse = commandObject.userResponses?.find((x: any) => x.userId === interaction.user.id);
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
    } catch (e: any) {
        console.error(`❌ There was an error running the ${commandObject.name} command:`);
        console.error(e);

        if (!e?.name?.includes("ConnectTimeoutError")) {
            sendGenericErrorReply(interaction);
        }
    }
};