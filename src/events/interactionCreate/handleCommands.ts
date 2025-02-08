import { Client, Interaction, MessageFlags } from 'discord.js';

import useCommandsStore from '@modules/commands/useCommandsStore';
import useConfig from '@modules/config/useConfig';
import useErrorReplying from '@modules/errors/useErrorReplying';
import useReplying from '@modules/messaging/useReplying';

const { sendTextReply } = useReplying();
const { sendGenericErrorReply, sendNoPermissionErrorReply } = useErrorReplying();
const { getLocalCommands } = useCommandsStore();
const { DEVS } = useConfig();

export default async (client: Client, interaction: Interaction) => {
    if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;

    const localCommands = await getLocalCommands();
    const commandObject = localCommands.find((cmd: any) => cmd.name === interaction.commandName);

    if (!commandObject) {
        await sendGenericErrorReply(interaction);
        return;
    }

    await interaction.deferReply({
        flags: commandObject.hasEphemeralResponse || (commandObject.hasEphemeralParameter && commandObject.getParameter<boolean>(interaction, 'ephemeral'))
            ? MessageFlags.Ephemeral
            : undefined
    });

    const foundUserReponse = commandObject.userResponses?.find((x: any) => x.userId === interaction.user.id);
    if (foundUserReponse) {
        await sendTextReply(interaction, foundUserReponse.response);
        return;
    }

    if (commandObject.onlyDevs) {
        if (!DEVS.includes(interaction.user.id)) {
            await sendNoPermissionErrorReply(interaction);
            return;
        }
    }

    try {
        await commandObject.execute(client, interaction);
    } catch (error: any) {
        console.error(`❌ There was an error running the ${commandObject.name} command:`);
        console.error(error);

        if (!error?.name?.includes("ConnectTimeoutError")) {
            await sendGenericErrorReply(interaction);
        }
    }
};