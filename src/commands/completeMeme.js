const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { X_EMOJI } = require("@modules/shared/constants/emojis");
const sendTextReply = require("@modules/messaging/sendTextReply");
const MemeCaptionSetterFactory = require("@modules/meme/caption-setters/MemeCaptionSetterFactory");
const MemeFilePathProviderFactory = require("@modules/meme/meme-file-url-getters/MemeFilePathProviderFactory");
const completeMemeMessageStore = require("@modules/meme/completeMemeMessageStore");
const generateBaseEmbed = require("@modules/embeds/generateBaseEmbed");
const sendReply = require("@modules/messaging/sendReply");

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
        const fontSize = interaction.options.get('fontsize')?.value;

        const finishedMemeData = await captionSetter.setCaption(fileUrl, { topCaption: topText, bottomCaption: bottomText, fontSize: fontSize });

        await message.channel.send({ files: [{attachment: finishedMemeData.file, name: `meme.${finishedMemeData.extension}`}] });
        interaction.editReply("✅ Meme sent");
    }
};

function sendMessageNotPreparedMessage(interaction) {
    return sendTextReply(interaction, `${X_EMOJI} You first need to prepare a message with a gif/image with **Right click > Apps > Meme**`, true);
}

function getFileExtension(urlString) {
    const parsedUrl = new URL(urlString);
    const pathname = parsedUrl.pathname;
    const extension = pathname.split('.').pop();
    return extension.includes('/') ? '' : `.${extension}`;
}