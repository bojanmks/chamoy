import useReplying from '@modules/messaging/useReplying';
import useErrorReplying from '@modules/errors/useErrorReplying';
import useCommandsStore from '@modules/commands/useCommandsStore';
import useConfig from '@modules/config/useConfig';

const { sendTextReply } = useReplying();
const { sendGenericErrorReply, sendNoPermissionErrorReply } = useErrorReplying();
const { getLocalCommands } = useCommandsStore();
const { DEVS } = useConfig();

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
        if (!DEVS.includes(interaction.user.id)) {
            sendNoPermissionErrorReply(interaction);
            return;
        }
    }

    try {
        await commandObject.execute(client, interaction);
    } catch (e: any) {
        console.error(`❌ There was an error running the ${commandObject.name} command:`);
        console.error(e);

        if (!e?.name?.includes("ConnectTimeoutError")) {
            sendGenericErrorReply(interaction);
        }
    }
};