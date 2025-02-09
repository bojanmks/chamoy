import { isBusy } from "@modules/busy/busy";
import BaseCommand from "@modules/commands/models/BaseCommand";
import { ICommandParameter } from "@modules/commands/models/ICommandParameter";
import { Emojis } from "@modules/emojis/enums/Emojis";
import { sendBotIsBusyReply } from "@modules/errors/errorReplying";
import { sendTextReply } from "@modules/messaging/replying";
import { useMainPlayer, useQueue } from "discord-player";
import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember } from "discord.js";

const getYoutubeTitle = require('get-youtube-title')

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

        const userVoiceChannel = (interaction.member as GuildMember)?.voice.channel;

        if (!userVoiceChannel) {
            await sendTextReply(interaction, `${Emojis.X} You need to be in a voice channel`);
        }

        // const targetedChannel = client.channels.cache.get(userVoiceChannel!.id);

        // if (targetedChannel?.type === ChannelType.GuildVoice) {
        //     // provera da li je voice kanal
        // }

        const player = useMainPlayer();
        
        const query = this.getParameter<string>(interaction, 'song')!;

        const youtubeVideoTitle = await tryToExtractYoutubeVideoTitle(query);

        const result = await player.play(userVoiceChannel!, youtubeVideoTitle ? youtubeVideoTitle : query);

        if (!queue || queue.isEmpty()) {
            await sendTextReply(interaction, `${Emojis.Play} Playing **${result.track.cleanTitle}**`);
            return;
        }
        
        await sendTextReply(interaction, `${Emojis.Play} Added **${result.track.cleanTitle}** to queue`);
    }
}

const YOUTUBE_TITLE_REMOVE_PATTERNS = [
    /\(.*official.*\)/i,
    /\[.*official.*\]/i,   
    /\(.*lyrics.*\)/i,
    /\[.*lyrics.*\]/i,
    /\(.*audio.*\)/i,
    /\[.*audio.*\]/i,
    /\(.*music video.*\)/i,
    /\[.*music video.*\]/i,
    /official music video/i,
    /official video/i,
    /music video/i,
    /official audio/i,
    /lyrics video/i,
    /ft\..*/i,
    /[-–_|]+/g, // Normalize separators
];

const tryToExtractYoutubeVideoTitle = async (url: string): Promise<string | null> => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);

    if (!match) {
        return null;
    }

    const videoId = match[1];

    return new Promise(resolve => {
        getYoutubeTitle(videoId, (err: any, title: string) => {
            if (err) {
                resolve(null);
                return;
            }

            YOUTUBE_TITLE_REMOVE_PATTERNS.forEach(pattern => {
                title = title.replace(pattern, "").trim();
            });
    
            // Clean up excess spaces, dashes, and symbols
            title = title.replace(/\s{2,}/g, " ").trim();

            resolve(title);
        });
    });
}

const command = new PlayCommand();

export default command;