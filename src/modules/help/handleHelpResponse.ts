import { devs } from '../../../config.json';
import getLocalCommands from "@modules/commands/getLocalCommands";
import sendReply from "@modules/messaging/sendReply";
import generateBaseEmbed from '@modules/embeds/generateBaseEmbed';
import { ButtonBuilder, ButtonStyle, ComponentType, ActionRowBuilder, ApplicationCommandType } from 'discord.js';
import { CURRENT_ENVIRONMENT } from "@modules/shared/constants/environments";
import sendGenericErrorReply from "@modules/errors/messages/sendGenericErrorReply";

const COMMANDS_PER_PAGE = 10;

export default async (client: any, interaction: any, userId: any) => {
    const commands = (await getLocalCommands(['commands']))
        .filter((x: any) => isCommandAvailable(x, userId) && x.type === ApplicationCommandType.ChatInput)
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

    if (!commands || !commands.length) {
        sendGenericErrorReply(interaction);
        return;
    }

    const message = generateMessage(client, commands);
    const sentMessage = await sendReply(interaction, message);

    const collector = sentMessage.createMessageComponentCollector({ componentType: ComponentType.Button });
    
    collector.on('collect', async (existingInteraction: any) => {
        goToPage(client, existingInteraction, commands, parseInt(existingInteraction.customId));
    });
}

function isCommandAvailable(command: any, userId: any) {
    if (command.environments && !command.environments.includes(CURRENT_ENVIRONMENT)) {
        return false;
    }

    if (command.onlyDevs && !devs.includes(userId)) {
        return false;
    }

    return true;
}

function generateMessage(client: any, commands: any, page = 0) {
    const embed = generateBaseEmbed(client, 'Commands');

    for (let command of commands.slice(COMMANDS_PER_PAGE * page, COMMANDS_PER_PAGE * (page + 1))) {
        embed.addFields({
            name: commandNameWithParameters(command),
            value: command.description,
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

function commandNameWithParameters(command: any) {
    let commandName = "/" + command.name;

    if (!command.options?.length) {
        return commandName;
    }

    // required parameters
    for (let param of command.options.filter((x: any) => x.required)) {
        commandName += ` \`\`<${param.name}>\`\``;
    }

    // optional parameters
    for (let param of command.options.filter((x: any) => !x.required)) {
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

function generateMessageActions(commands: any, page: any) {
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

function goToPage(client: any, interaction: any, commands: any, page: any) {
    const message = generateMessage(client, commands, page);
    interaction.update(message);
}