import { Client, Interaction, MessageFlags } from 'discord.js';
import { sendGenericErrorReply, sendNoPermissionErrorReply } from '@modules/errors/errorReplying';

import config from '@modules/config/config';
import { getLocalCommands } from '@modules/commands/commandStore';
import { sendTextReply } from '@modules/messaging/replying';
import { useMainPlayer } from 'discord-player';

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
        if (!config.devs.includes(interaction.user.id)) {
            await sendNoPermissionErrorReply(interaction);
            return;
        }
    }

    try {
        const player = useMainPlayer();
        
        await player.context.provide(
            { guild: interaction.guild! },
            async () => await commandObject.execute(client, interaction)
        );
    } catch (error: any) {
        console.error(`❌ There was an error running the ${commandObject.name} command:`);
        console.error(error);

        await sendGenericErrorReply(interaction);
    }
};