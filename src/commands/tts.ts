import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import useBusy from "@modules/busy/useBusy";
import useReplying from "@modules/messaging/useReplying";
import useTtsLanguages from "@modules/tts/useTtsLanguages";
import useEmojis from "@modules/emojis/useEmojis";
import useErrorReplying from "@modules/errors/useErrorReplying";
import useCommands from "@modules/commands/useCommands";
import { ICommandParameter } from "@modules/commands/models/ICommandParameter";

const gTTS = require("gtts");

const { isBusy, setBusy, setNotBusy } = useBusy();
const { sendTextReply } = useReplying();
const { getTtsLanguges, findTtsLanguage } = useTtsLanguages();
const { CHECK_EMOJI, X_EMOJI } = useEmojis();
const { sendBotIsBusyReply } = useErrorReplying();
const { BaseCommand } = useCommands();

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
            await sendTextReply(interaction, `${X_EMOJI} You need to be in a voice channel`, true);
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

            await sendTextReply(interaction, `${CHECK_EMOJI} Saying **${messageToSay}** in **${findTtsLanguage(language)?.name}**`, true);
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