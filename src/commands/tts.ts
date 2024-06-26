import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember } from "discord.js";
import sendTextReply from "@modules/messaging/sendTextReply";
import { CHECK_EMOJI, X_EMOJI } from "@modules/shared/constants/emojis";
import generateCommandChoices from "@modules/commands/generateCommandChoices";
import ttsLanguagesRepository from "@modules/tts/ttsLanguagesRepository";
import busyUtil from "@modules/busy/busyUtil";
import sendBotIsBusyReply from "@modules/errors/messages/sendBotIsBusyReply";
import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import { BaseCommand } from "@modules/commands/models/BaseCommand";
import { CommandParameter } from "@modules/commands/models/CommandParameter";
const gTTS = require("gtts");

class TtsCommand extends BaseCommand {
    name: string = 'tts';
    description: string | null = 'Make bot say a message in current voice channel';

    override options: CommandParameter[] | null = [
        {
            name: 'language',
            description: 'Language',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: generateCommandChoices(ttsLanguagesRepository.get()),
            default: undefined
        },
        {
            name: 'message',
            description: 'Message to say',
            type: ApplicationCommandOptionType.String,
            required: true,
            default: undefined,
            choices: null
        }
    ];
    
    execute(client: Client, interaction: CommandInteraction): void {
        const serverId = interaction.guildId;
        if (busyUtil.isBusy(serverId)) {
            return sendBotIsBusyReply(interaction);
        }

        const interactionUser = interaction.member as GuildMember;
        const usersVoiceChannel = interactionUser.voice.channel;
        if (!usersVoiceChannel) {
            return sendTextReply(interaction, `${X_EMOJI} You need to be in a voice channel`, true);
        }

        const language = this.getParameter<string>(interaction, 'language');
        const messageToSay = this.getParameter<string>(interaction, 'message');

        const connection = joinVoiceChannel({
            channelId: usersVoiceChannel.id,
            guildId: serverId!,
            adapterCreator: interaction.guild!.voiceAdapterCreator
        });

        try {
            busyUtil.toggleBusy(serverId);

            playAudio(connection, messageToSay, language, () => {
                connection.disconnect();
                busyUtil.toggleBusy(serverId);
            });

            sendTextReply(interaction, `${CHECK_EMOJI} Saying **${messageToSay}** in **${ttsLanguagesRepository.find(language)?.name}**`, true);
        }
        catch (error) {
            connection.disconnect();
            busyUtil.setNotBusy(serverId);
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