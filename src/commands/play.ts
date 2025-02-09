import { isBusy } from "@modules/busy/busy";
import BaseCommand from "@modules/commands/models/BaseCommand";
import { ICommandParameter } from "@modules/commands/models/ICommandParameter";
import { Emojis } from "@modules/emojis/enums/Emojis";
import { sendBotIsBusyReply } from "@modules/errors/errorReplying";
import { sendTextReply } from "@modules/messaging/replying";
import { useMainPlayer, useQueue } from "discord-player";
import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember } from "discord.js";

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
            await sendTextReply(interaction, `${Emojis.X} You need to be in a voice channel`);
        }

        // const targetedChannel = client.channels.cache.get(userVoiceChannel!.id);

        // if (targetedChannel?.type === ChannelType.GuildVoice) {
        //     // provera da li je voice kanal
        // }

        try {
            const result = await player.play(userVoiceChannel!, query!);

            if (!queue || queue.isEmpty()) {
                await sendTextReply(interaction, `${Emojis.Play} Playing **${result.track.cleanTitle}**`);
                return;
            }
            
            await sendTextReply(interaction, `${Emojis.Play} Added **${result.track.cleanTitle}** to queue`);
        }
        catch (err) {
            throw err;
        }
    }
}

const command = new PlayCommand();

export default command;