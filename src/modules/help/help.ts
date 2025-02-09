import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, Client, ComponentType, InteractionResponse, Message } from "discord.js";

import { CURRENT_ENVIRONMENT } from "@modules/environments/environments";
import { ICommand } from '@modules/commands/models/ICommand';
import config from "@modules/config/config";
import { getLocalCommands } from "@modules/commands/commandStore";
import { makeBaseEmbed } from "@modules/embeds/embeds";
import { sendGenericErrorReply } from "@modules/errors/errorReplying";

const COMMANDS_PER_PAGE = 10;

const getAvailableCommandsForUser = async (userId: any) => {
    const commands = (await getLocalCommands())
        .filter((x: any) => isCommandAvailable(x, userId) && x.type === ApplicationCommandType.ChatInput)
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

    return commands;
}

export const handleHelpResponse = async (client: any, interaction: any, userId: any) => {
    const commands = await getAvailableCommandsForUser(userId);

    if (!commands || !commands.length) {
        await sendGenericErrorReply(interaction);
        return;
    }

    const message = generateMessage(client, commands);

    return message;
}

const isCommandAvailable = (command: any, userId: any) => {
    if (command.environments && !command.environments.includes(CURRENT_ENVIRONMENT)) {
        return false;
    }

    if (command.onlyDevs && !config.devs.includes(userId)) {
        return false;
    }

    return true;
}

const generateMessage = (client: Client, commands: ICommand[], page = 0): any => {
    const embed = makeBaseEmbed(client, 'Commands');

    for (let command of commands.slice(COMMANDS_PER_PAGE * page, COMMANDS_PER_PAGE * (page + 1))) {
        embed.addFields({
            name: commandNameWithParameters(command),
            value: command.description!,
            inline: false
        });
    }

    const actions = generateMessageActions(commands, page);

    return {
        embeds: [embed],
        components: [actions]
    };
}

const commandNameWithParameters = (command: ICommand): string => {
    let commandName = "/" + command.name;

    if (!command.computedOptions?.length) {
        return commandName;
    }

    // required parameters
    for (let param of command.computedOptions.filter((x: any) => x.required)) {
        commandName += ` \`\`<${param.name}>\`\``;
    }

    // optional parameters
    for (let param of command.computedOptions.filter((x: any) => !x.required)) {
        commandName += ` \`\`[${param.name}]\`\``;
    }

    return commandName;
}

const BACK_BUTTON = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel('Previous')
    .setEmoji('⬅️');

const FORWARD_BUTTON = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel('Next')
    .setEmoji('➡️');

const generateMessageActions = (commands: any, page: any) => {
    const actions = new ActionRowBuilder();

    const isFirstPage = page === 0;
    const isLastPage = commands.length <= (page + 1) * COMMANDS_PER_PAGE;

    if (!isFirstPage) {
        BACK_BUTTON.setCustomId((page - 1).toString());
        actions.addComponents(BACK_BUTTON);
    }

    if (!isLastPage) {
        FORWARD_BUTTON.setCustomId((page + 1).toString());
        actions.addComponents(FORWARD_BUTTON);
    }

    return actions;
}

const goToPage = (client: any, interaction: any, commands: any, page: any) => {
    const message = generateMessage(client, commands, page);
    interaction.update(message);
}

export const listenToHelpEmbedInteractions = async (client: Client, userId: any, helpEmbedMessage: Message<boolean> | InteractionResponse<boolean>) => {
    const commands = await getAvailableCommandsForUser(userId);

    const collector = helpEmbedMessage.createMessageComponentCollector({ componentType: ComponentType.Button });
    
    collector.on('collect', async (existingInteraction: any) => {
        goToPage(client, existingInteraction, commands, parseInt(existingInteraction.customId));
    });
}