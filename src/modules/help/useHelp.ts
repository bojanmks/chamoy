import { Command } from '@modules/commands/useCommands';
import useCommandsStore from '@modules/commands/useCommandsStore';
import useConfig from '@modules/config/useConfig';
import useEmbeds from "@modules/embeds/useEmbeds";
import useEnvironments from '@modules/environments/useEnvironments';
import useErrorReplying from '@modules/errors/useErrorReplying';
import useReplying from '@modules/messaging/useReplying';
import { ApplicationCommandType, ComponentType, Client, ButtonBuilder, ButtonStyle, ActionRowBuilder, InteractionResponse, Message } from "discord.js";

const { sendReply } = useReplying();
const { makeBaseEmbed } = useEmbeds();
const { sendGenericErrorReply } = useErrorReplying();
const { CURRENT_ENVIRONMENT } = useEnvironments();
const { getLocalCommands } = useCommandsStore();
const { DEVS } = useConfig();

const COMMANDS_PER_PAGE = 10;

const getAvailableCommandsForUser = async (userId: any) => {
    const commands = (await getLocalCommands(['commands']))
        .filter((x: any) => isCommandAvailable(x, userId) && x.type === ApplicationCommandType.ChatInput)
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

    return commands;
}

const handleHelpResponse = async (client: any, interaction: any, userId: any) => {
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

    if (command.onlyDevs && !DEVS.includes(userId)) {
        return false;
    }

    return true;
}

const generateMessage = (client: Client, commands: Command[], page = 0): any => {
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
        components: [actions],
        ephemeral: true
    };
}

const commandNameWithParameters = (command: Command): string => {
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

const listenToHelpEmbedInteractions = async (client: Client, userId: any, helpEmbedMessage: Message<boolean> | InteractionResponse<boolean>) => {
    const commands = await getAvailableCommandsForUser(userId);

    const collector = helpEmbedMessage.createMessageComponentCollector({ componentType: ComponentType.Button });
    
    collector.on('collect', async (existingInteraction: any) => {
        goToPage(client, existingInteraction, commands, parseInt(existingInteraction.customId));
    });
}

export default () => {
    return {
        handleHelpResponse,
        listenToHelpEmbedInteractions
    }
}