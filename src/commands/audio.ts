import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember } from 'discord.js';
import path from 'path';
import { joinVoiceChannel, createAudioResource } from '@discordjs/voice';
import { Audio } from '@modules/audio/models/Audio'
import { ICommandParameter } from '@modules/commands/models/ICommandParameter';
import BaseCommand from '@modules/commands/models/BaseCommand';
import { audioRepository } from '@database/repositories/repositories';
import { isBusy, setBusy, setNotBusy } from '@modules/busy/busy';
import MyAudioPlayer from '@modules/audio/models/MyAudioPlayer';
import { sendTextReply } from '@modules/messaging/replying';
import { sendBotIsBusyReply, sendGenericErrorReply } from '@modules/errors/errorReplying';
import { Emojis } from '@modules/emojis/enums/Emojis';

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
            await sendTextReply(interaction, `${Emojis.X} You need to be in a voice channel`);
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

            await sendTextReply(interaction, `${Emojis.Play} Playing **${audio.name}**`);
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