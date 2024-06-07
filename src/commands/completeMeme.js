const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { X_EMOJI } = require("@modules/shared/constants/emojis");
const sendTextReply = require("@modules/messaging/sendTextReply");
const MemeCaptionSetterFactory = require("@modules/meme/caption-setters/MemeCaptionSetterFactory");
const MemeFilePathProviderFactory = require("@modules/meme/meme-file-url-getters/MemeFilePathProviderFactory");
const completeMemeMessageStore = require("@modules/meme/completeMemeMessageStore");
const wait = require("@modules/shared/wait");

const DEFAULT_FONT_SIZE = 40;

module.exports = {
    name: 'completememe',
    description: 'Complete meme',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'toptext',
            description: 'Top text',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'bottomtext',
            description: 'Bottom text',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'fontsize',
            description: 'Font size',
            type: ApplicationCommandOptionType.Number,
            required: false
        }
    ],
    callback: async (client, interaction) => {
        const userId = interaction.user.id;
        const messageId = completeMemeMessageStore.findMessageByUser(userId);

        if (!messageId) {
            return sendMessageNotPreparedMessage(interaction);
        }

        const message = await interaction.channel.messages.fetch(messageId);

        if (!message || !message.content) {
            return sendMessageNotPreparedMessage(interaction);
        }

        const urlProvider = new MemeFilePathProviderFactory(message).makePathProvider();

        if (!urlProvider) {
            return sendTextReply(interaction, `${X_EMOJI} Unknown file source`, true);
        }

        interaction.deferReply({ ephemeral: true });

        const fileUrl = await urlProvider.getUrl();

        if (!fileUrl) {
            return interaction.editReply(`${X_EMOJI} An error occured while fetching the file url`);
        }

        const fileExtension = getFileExtension(fileUrl);

        const captionSetter = new MemeCaptionSetterFactory().makeCaptionSetter(fileExtension);

        if (!captionSetter) {
            return interaction.editReply(`${X_EMOJI} Unsupported file type`);
        }

        const topText = interaction.options.get('toptext').value;
        const bottomText = interaction.options.get('bottomtext').value;
        const fontSize = interaction.options.get('fontsize')?.value ?? DEFAULT_FONT_SIZE;

        let temporaryMessage = null;

        const finishedMemeData = await captionSetter.setCaption(
            fileUrl,
            {
                topCaption: topText,
                bottomCaption: bottomText,
                fontSize: fontSize,
                temporaryUrlHandler: async (url) => {
                    temporaryMessage = await handleTemporaryUrl(url, message.channel);
                }
            });

        await handleFinishedResponse(message.channel, temporaryMessage, finishedMemeData);

        interaction.editReply("✅ Meme sent");
    }
};

const sendMessageNotPreparedMessage = (interaction) => {
    return sendTextReply(interaction, `${X_EMOJI} You first need to prepare a message with a gif/image with **Right click > Apps > Meme**`, true);
}

const getFileExtension = (urlString) => {
    const parsedUrl = new URL(urlString);
    const pathname = parsedUrl.pathname;
    const extension = pathname.split('.').pop();
    return extension.includes('/') ? '' : `.${extension}`;
}

const handleTemporaryUrl = async (tempUrl, channel) => {
    const temporaryMessage = await channel.send(tempUrl)

    // To handle cases where the finished attachment was uploaded quickly
    // (editing the message too quickly can be weird)
    await wait(500);

    return temporaryMessage;
}

const handleFinishedResponse = async (channel, temporaryMessage, finishedMemeData) => {
    if (!temporaryMessage && finishedMemeData.fileUrl) {
        return await channel.send(finishedMemeData.fileUrl);
    }
    else if (finishedMemeData.file) {
        const attachmentData = { files: [{attachment: finishedMemeData.file, name: `meme.${finishedMemeData.extension}`}] };

        if (temporaryMessage) {
            return await temporaryMessage.edit({ content: '', ...attachmentData });
        }

        await channel.send(attachmentData);
    }
}