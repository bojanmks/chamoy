import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember } from 'discord.js';
import path from 'path';
import { joinVoiceChannel, createAudioResource } from '@discordjs/voice';
import useBusy from '@modules/busy/useBusy';
import useReplying from '@modules/messaging/useReplying';
import useAudioPlayer from '@modules/audio/useAudioPlayer';
import useEmojis from '@modules/emojis/useEmojis';
import useErrorReplying from '@modules/errors/useErrorReplying';
import useCommands from '@modules/commands/useCommands';
import useRepositories from '@database/repositories/useRepositories';
import { Audio } from '@modules/audio/models/Audio'
import { ICommandParameter } from '@modules/commands/models/ICommandParameter';

const { isBusy, setBusy, setNotBusy } = useBusy();
const { sendTextReply } = useReplying();
const { MyAudioPlayer } = useAudioPlayer();
const { X_EMOJI, PLAY_EMOJI } = useEmojis();
const { sendBotIsBusyReply, sendGenericErrorReply } = useErrorReplying();
const { BaseCommand } = useCommands();
const { audioRepository } = useRepositories();

class AudioCommand extends BaseCommand {
    name: string = 'audio';
    description: string = 'Play audio';

    override options: ICommandParameter[] = [
        {
            name: 'name',
            description: 'Name of the audio',
            type: ApplicationCommandOptionType.Number,
            choicesRepositoryOptions: {
                repository: audioRepository,
                choiceNameGetter: (entity: Audio) => entity.name,
                choiceValueGetter: (entity: Audio) => entity.id
            },
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
            await sendTextReply(interaction, `${X_EMOJI} You need to be in a voice channel`);
            return;
        }

        const audioId = this.getParameter<number>(interaction, 'name');
        const audio = await audioRepository.find(audioId!);

        if (!audio) {
            await sendGenericErrorReply(interaction);
            return;
        }

        const connection = joinVoiceChannel({
            channelId: usersVoiceChannel.id,
            guildId: serverId!,
            adapterCreator: interaction.guild!.voiceAdapterCreator
        });

        try {
            setBusy(serverId);

            const relativeFilePath = `${process.env.FILES_BASE_PATH}/audio/${audio.filePath}`;
            const absoluteFilePath = path.resolve(relativeFilePath);
            const audioResource = createAudioResource(absoluteFilePath);

            const audioPlayer = new MyAudioPlayer();

            audioPlayer.playAudio(connection, audioResource, () => {
                connection.disconnect();
                setNotBusy(serverId);
            });

            await sendTextReply(interaction, `${PLAY_EMOJI} Playing **${audio.name}**`);
        }
        catch (error) {
            connection.disconnect();
            setNotBusy(serverId);
            throw error;
        }
    }
}

const command = new AudioCommand();

export default command;