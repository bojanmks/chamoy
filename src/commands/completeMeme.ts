import { ApplicationCommandOptionType, Client, CommandInteraction } from "discord.js";
import { ICommandParameter } from "@modules/commands/models/ICommandParameter";
import BaseCommand from "@modules/commands/models/BaseCommand";
import { sendTextReply } from "@modules/messaging/replying";
import { Emojis } from "@modules/emojis/enums/Emojis";
import { wait } from "@modules/shared/wait";
import { completeMemeMessageStore } from "@modules/meme/completeMeme";
import MemeCaptionSetterFactory from "@modules/meme/models/MemeCaptionSetterFactory";
import MemeFilePathProviderFactory from "@modules/meme/models/MemeFilePathProviderFactory";

const DEFAULT_FONT_SIZE = 40;

class CompleteMemeCommand extends BaseCommand {
    name: string = 'completememe';
    description: string = 'Complete meme';

    override options?: ICommandParameter[] = [
        {
            name: 'toptext',
            description: 'Top text',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'bottomtext',
            description: 'Bottom text',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'fontsize',
            description: 'Font size',
            type: ApplicationCommandOptionType.Number,
            default: DEFAULT_FONT_SIZE
        }
    ];

    override hasEphemeralResponse?: boolean | undefined = true;
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const userId = interaction.user.id;
        const messageId = completeMemeMessageStore.findMessageByUser(userId);

        if (!messageId) {
            await sendMessageNotPreparedMessage(interaction)
            return;
        }

        const message = await interaction.channel?.messages.fetch(messageId);

        if (!message || !message.content) {
            await sendMessageNotPreparedMessage(interaction);
            return;
        }

        const urlProvider = new MemeFilePathProviderFactory(message).makePathProvider();

        if (!urlProvider) {
            await sendTextReply(interaction, `${Emojis.X} Unknown file source`);
            return;
        }

        const fileUrl = await urlProvider.getUrl();

        if (!fileUrl) {
            await sendTextReply(interaction, `${Emojis.X} An error occured while fetching the file url`);
            return;
        }

        const fileExtension = getFileExtension(fileUrl);

        const captionSetter = new MemeCaptionSetterFactory().makeCaptionSetter(fileExtension);

        if (!captionSetter) {
            await sendTextReply(interaction, `${Emojis.X} Unsupported file type`);
            return;
        }

        const topText = this.getParameter<string>(interaction, 'toptext');
        const bottomText = this.getParameter<string>(interaction, 'bottomtext');
        const fontSize = this.getParameter<number>(interaction, 'fontsize');

        let temporaryMessageData = null;

        const finishedMemeData = await captionSetter.setCaption(
            fileUrl,
            {
                topCaption: topText,
                bottomCaption: bottomText,
                fontSize: fontSize,
                temporaryUrlHandler: async (url: string) => {
                    temporaryMessageData = await sendTemporaryUrl(url, message.channel);
                }
            });

        await handleFinishedResponse(message.channel, temporaryMessageData, finishedMemeData);

        await sendTextReply(interaction, "✅ Meme sent");
    }

}

const sendMessageNotPreparedMessage = async (interaction: any) => {
    await sendTextReply(interaction, `${Emojis.X} You first need to prepare a message with a gif/image with **Right click > Apps > Meme**`);
    return;
}

const getFileExtension = (urlString: any) => {
    const parsedUrl = new URL(urlString);
    const pathname = parsedUrl.pathname;
    const extension = pathname.split('.').pop();
    return extension?.includes('/') ? '' : `.${extension}`;
}

const sendTemporaryUrl = async (tempUrl: any, channel: any) => {
    const temporaryMessage = await channel.send(tempUrl)

    return {
        message: temporaryMessage,
        time: Date.now()
    };
}

const minTempMessageTimeElapsed = 1000;

const handleFinishedResponse = async (channel: any, temporaryMessageData: any, finishedMemeData: any) => {
    if (!temporaryMessageData && finishedMemeData.fileUrl) {
        return await channel.send(finishedMemeData.fileUrl);
    }
    else if (finishedMemeData.file) {
        const attachmentData = { files: [{attachment: finishedMemeData.file, name: `meme.${finishedMemeData.extension}`}] };

        if (temporaryMessageData) {
            const timeElapsed = Date.now() - temporaryMessageData.time;

            if (minTempMessageTimeElapsed > timeElapsed) {
                // To handle cases where the finished attachment was downloaded too quickly
                // (editing the message too quickly can be weird)
                await wait(minTempMessageTimeElapsed - timeElapsed);
            }

            return await temporaryMessageData.message.edit({ content: '', ...attachmentData });
        }

        await channel.send(attachmentData);
    }
}

const command = new CompleteMemeCommand();

export default command;