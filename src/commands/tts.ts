const { ApplicationCommandOptionType } = require("discord.js");
const sendTextReply = require("@modules/messaging/sendTextReply");
const { CHECK_EMOJI, X_EMOJI } = require("@modules/shared/constants/emojis");
const generateCommandChoices = require("@modules/commands/generateCommandChoices");
const ttsLanguagesRepository = require("@modules/tts/ttsLanguagesRepository");
const busyUtil = require("@modules/busy/busyUtil");
const sendBotIsBusyReply = require("@modules/errors/messages/sendBotIsBusyReply");
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const gTTS = require("gtts");

module.exports = {
    name: 'tts',
    description: 'Make bot say a message in current voice channel',
    options: [
        {
            name: 'language',
            description: 'Language',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: generateCommandChoices(ttsLanguagesRepository.get())
        },
        {
            name: 'message',
            description: 'Message to say',
            type: ApplicationCommandOptionType.String,
            required: true
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

        const language = interaction.options.get('language').value;
        const messageToSay = interaction.options.get('message').value;

        const connection = joinVoiceChannel({
            channelId: usersVoiceChannel.id,
            guildId: serverId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        try {
            busyUtil.toggleBusy(serverId);

            playAudio(connection, messageToSay, language, () => {
                connection.disconnect();
                busyUtil.toggleBusy(serverId);
            });

            sendTextReply(interaction, `${CHECK_EMOJI} Saying **${messageToSay}** in **${ttsLanguagesRepository.find(language).name}**`, true);
        }
        catch (error) {
            connection.disconnect();
            busyUtil.setNotBusy(serverId);
            throw error;
        }
    }
};

function playAudio(connection, message, language, onFinish) {
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