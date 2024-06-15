const { ApplicationCommandOptionType } = require('discord.js');
const audioRepository = require('@modules/audio/audioRepository');
const busyUtil = require('@modules/busy/busyUtil');
const sendBotIsBusyReply = require('@modules/errors/messages/sendBotIsBusyReply');
const sendGenericErrorReply = require('@modules/errors/messages/sendGenericErrorReply');
const sendTextReply = require('@modules/messaging/sendTextReply');
const path = require('path');
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const generateCommandChoices = require('@modules/commands/generateCommandChoices');
const { X_EMOJI, PLAY_EMOJI } = require('@modules/shared/constants/emojis');

module.exports = {
    name: 'audio',
    description: 'Play audio',
    options: [
        {
            name: 'name',
            description: 'Name of the audio',
            type: ApplicationCommandOptionType.Number,
            required: true,
            choices: generateCommandChoices(audioRepository.get())
        }
    ],
    callback: (client, interaction) => {
        const serverId = interaction.guildId;

        if (busyUtil.isBusy(serverId)) {
            return sendBotIsBusyReply(interaction);
        }

        const usersVoiceChannel = interaction.member.voice.channel;
        if (!usersVoiceChannel) {
            return sendTextReply(interaction, `${X_EMOJI} You need to be in a voice channel`, true);
        }

        const audioId = interaction.options.get('name').value;
        const audio = audioRepository.find(audioId);

        if (!audio) {
            return sendGenericErrorReply(interaction);
        }

        const connection = joinVoiceChannel({
            channelId: usersVoiceChannel.id,
            guildId: serverId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        try {
            busyUtil.toggleBusy(serverId);

            playAudio(connection, audio, () => {
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
};

function playAudio(connection, audio, onFinish) {
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