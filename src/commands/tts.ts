import { ApplicationCommandOptionType, Client, CommandInteraction, Emoji, GuildMember } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import { ICommandParameter } from "@modules/commands/models/ICommandParameter";
import BaseCommand from "@modules/commands/models/BaseCommand";
import { isBusy, setBusy, setNotBusy } from "@modules/busy/busy";
import { sendTextReply } from "@modules/messaging/replying";
import { sendBotIsBusyReply } from "@modules/errors/errorReplying";
import { Emojis } from "@modules/emojis/enums/Emojis";
import { getTtsLanguges, findTtsLanguage } from "@modules/tts/ttsLanguages";

const gTTS = require("gtts");

class TtsCommand extends BaseCommand {
    name: string = 'tts';
    override description?: string = 'Make bot say a message in current voice channel';

    override options?: ICommandParameter[] = [
        {
            name: 'language',
            description: 'Language',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: getTtsLanguges().map((x: any) => ({
                name: x.name,
                value: x.id
            }))
        },
        {
            name: 'message',
            description: 'Message to say',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ];

    override hasEphemeralResponse?: boolean | undefined = true;
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const serverId = interaction.guildId;
        if (isBusy(serverId)) {
            await sendBotIsBusyReply(interaction);
            return;
        }

        const interactionUser = interaction.member as GuildMember;
        const usersVoiceChannel = interactionUser.voice.channel;
        if (!usersVoiceChannel) {
            await sendTextReply(interaction, `${Emojis.X} You need to be in a voice channel`);
            return;
        }

        const language = this.getParameter<string>(interaction, 'language');
        const messageToSay = this.getParameter<string>(interaction, 'message');

        const connection = joinVoiceChannel({
            channelId: usersVoiceChannel.id,
            guildId: serverId!,
            adapterCreator: interaction.guild!.voiceAdapterCreator
        });

        try {
            setBusy(serverId);

            playAudio(connection, messageToSay, language, () => {
                connection.disconnect();
                setNotBusy(serverId);
            });

            await sendTextReply(interaction, `${Emojis.Check} Saying **${messageToSay}** in **${findTtsLanguage(language)?.name}**`);
        }
        catch (error) {
            connection.disconnect();
            setNotBusy(serverId);
            throw error;
        }
    }
}

function playAudio(connection: any, message: any, language: any, onFinish: any) {
    const audioPlayer = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause
        }
    });

    const gtts = new gTTS(message, language);
    const stream = gtts.stream();

    const audioResource = createAudioResource(stream);

    connection.subscribe(audioPlayer);

    audioPlayer.play(audioResource);

    audioPlayer.on(AudioPlayerStatus.Idle, () => {
        if (onFinish) {
            onFinish();
        }
    });
}

const command = new TtsCommand();

export default command;