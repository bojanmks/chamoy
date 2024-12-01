import { ApplicationCommandOptionType, ActivityType, PresenceUpdateStatus, Client, CommandInteraction } from "discord.js";
import usePresenceRateLimiting from "@modules/presence/usePresenceRateLimiting";
import usePresence from "@modules/presence/usePresence";
import useReplying from "@modules/messaging/useReplying";
import useEmojis from "@modules/emojis/useEmojis";
import useCommands, { CommandParameter } from "@modules/commands/useCommands";

const { setPresence } = usePresence();
const { onCanChangePresence, sendPresenceChangeTimeLeftReply } = usePresenceRateLimiting();
const { sendTextReply } = useReplying();
const { CHECK_EMOJI } = useEmojis();
const { BaseCommand } = useCommands();

class SetPresenceCommand extends BaseCommand {
    name: string = 'setpresence';
    description?: string = 'Set bot presence';
    
    override options?: CommandParameter[] = [
        {
            name: 'name',
            description: 'Activity name',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'type',
            description: 'Activity type',
            type: ApplicationCommandOptionType.Number,
            required: true,
            choices: [
                {
                    name: 'Competing',
                    value: ActivityType.Competing
                },
                {
                    name: 'Listening',
                    value: ActivityType.Listening
                },
                {
                    name: 'Playing',
                    value: ActivityType.Playing
                },
                {
                    name: 'Streaming',
                    value: ActivityType.Streaming
                },
                {
                    name: 'Watching',
                    value: ActivityType.Watching
                }
            ]
        },
        {
            name: 'status',
            description: 'Bot status',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Do not disturb',
                    value: PresenceUpdateStatus.DoNotDisturb
                },
                {
                    name: 'Idle',
                    value: PresenceUpdateStatus.Idle
                },
                {
                    name: 'Online',
                    value: PresenceUpdateStatus.Online
                }
            ]
        }
    ];

    execute(client: Client, interaction: CommandInteraction): void {
        onCanChangePresence(() => {
            const activityName = this.getParameter<string>(interaction, 'name');
            const activityType = this.getParameter<number>(interaction, 'type');
            const status = this.getParameter<string>(interaction, 'status');

            setPresence(client, activityName, activityType, status);

            sendTextReply(interaction, `${CHECK_EMOJI} Presence was set`, true);
        }, () => {
            sendPresenceChangeTimeLeftReply(interaction);
        });
    }
}

const command = new SetPresenceCommand();

export default command;