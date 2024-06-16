import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember } from 'discord.js';
import audioRepository from '@modules/audio/audioRepository';
import busyUtil from '@modules/busy/busyUtil';
import sendBotIsBusyReply from '@modules/errors/messages/sendBotIsBusyReply';
import sendGenericErrorReply from '@modules/errors/messages/sendGenericErrorReply';
import sendTextReply from '@modules/messaging/sendTextReply';
import path from 'path';
import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import generateCommandChoices from '@modules/commands/generateCommandChoices';
import { X_EMOJI, PLAY_EMOJI } from '@modules/shared/constants/emojis';
import { BaseCommand } from '@modules/commands/models/BaseCommand';

class AudioCommand extends BaseCommand {
    name: string = 'audio';
    description: string = 'Play audio';

    override options: any[] = [
        {
            name: 'name',
            description: 'Name of the audio',
            type: ApplicationCommandOptionType.Number,
            required: true,
            choices: generateCommandChoices(audioRepository.get())
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

        const audioId = interaction.options.get('name')?.value;
        const audio = audioRepository.find(audioId);

        if (!audio) {
            return sendGenericErrorReply(interaction);
        }

        const connection = joinVoiceChannel({
            channelId: usersVoiceChannel.id,
            guildId: serverId!,
            adapterCreator: interaction.guild!.voiceAdapterCreator
        });

        try {
            busyUtil.toggleBusy(serverId);

            this.playAudio(connection, audio, () => {
                connection.disconnect();
                busyUtil.toggleBusy(serverId);
            });

            sendTextReply(interaction, `${PLAY_EMOJI} Playing **${audio.name}**`, true);
        }
        catch (error) {
            connection.disconnect();
            busyUtil.setNotBusy(serverId);
            throw error;
        }
    }

    private playAudio(connection: any, audio: any, onFinish: any) {
        const audioPlayer = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            }
        });
    
        const relativeFilePath = `./src/assets/audio/${audio.fileName}`;
        const absoluteFilePath = path.resolve(relativeFilePath);
        const audioResource = createAudioResource(absoluteFilePath);
    
        connection.subscribe(audioPlayer);
    
        audioPlayer.play(audioResource);
    
        audioPlayer.on(AudioPlayerStatus.Idle, () => {
            if (onFinish) {
                onFinish();
            }
        });
    }
}

const command = new AudioCommand();

export default command;