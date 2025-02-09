import useBusy from "@modules/busy/useBusy";
import { ICommandParameter } from "@modules/commands/models/ICommandParameter";
import useCommands from "@modules/commands/useCommands";
import useEmojis from "@modules/emojis/useEmojis";
import useErrorReplying from "@modules/errors/useErrorReplying";
import useReplying from "@modules/messaging/useReplying";
import { useMainPlayer, useQueue } from "discord-player";
import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember } from "discord.js";

const { BaseCommand } = useCommands();
const { sendTextReply } = useReplying();
const { PLAY_EMOJI, X_EMOJI } = useEmojis();
const { isBusy } = useBusy();
const { sendBotIsBusyReply } = useErrorReplying();

class PlayCommand extends BaseCommand {
    name: string = 'play';
    description: string = 'Play a song';

    override options: ICommandParameter[] = [
        {
            name: 'song',
            description: 'Song name/url',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ];

    override hasEphemeralResponse?: boolean | undefined = true;

    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const guildId = interaction.guildId;

        const queue = useQueue();

        if (isBusy(guildId) && !queue?.currentTrack) {
            await sendBotIsBusyReply(interaction);
            return;
        }

        const player = useMainPlayer();
        
        const query = this.getParameter<string>(interaction, 'song');

        const userVoiceChannel = (interaction.member as GuildMember)?.voice.channel;

        if (!userVoiceChannel) {
            await sendTextReply(interaction, `${X_EMOJI} You need to be in a voice channel`);
        }

        // const targetedChannel = client.channels.cache.get(userVoiceChannel!.id);

        // if (targetedChannel?.type === ChannelType.GuildVoice) {
        //     // provera da li je voice kanal
        // }

        try {
            const result = await player.play(userVoiceChannel!, query!);

            if (!queue || queue.isEmpty()) {
                await sendTextReply(interaction, `${PLAY_EMOJI} Playing **${result.track.cleanTitle}**`);
                return;
            }
            
            await sendTextReply(interaction, `${PLAY_EMOJI} Added **${result.track.cleanTitle}** to queue`);
        }
        catch (err) {
            throw err;
        }
    }
}

const command = new PlayCommand();

export default command;