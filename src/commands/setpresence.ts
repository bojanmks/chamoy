import { ApplicationCommandOptionType, ActivityType, PresenceUpdateStatus, Client, CommandInteraction } from "discord.js";
import setPresence from "@modules/presence/setPresence";
import sendTextReply from "@modules/messaging/sendTextReply";
import presenceRatelimitUtil from "@modules/presence/presenceRatelimitUtil";
import { CHECK_EMOJI } from "@modules/shared/constants/emojis";
import { BaseCommand } from "@modules/commands/models/BaseCommand";
import { CommandParameter } from "@modules/commands/models/CommandParameter";

class SetPresenceCommand extends BaseCommand {
    name: string = 'setpresence';
    description: string | null = 'Set bot presence';
    
    override options: CommandParameter[] | null = [
        {
            name: 'name',
            description: 'Activity name',
            type: ApplicationCommandOptionType.String,
            required: true,
            default: undefined,
            choices: null
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
            ],
            default: undefined
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
            ],
            default: undefined
        }
    ];

    execute(client: Client, interaction: CommandInteraction): void {
        presenceRatelimitUtil.onCanChangePresence(() => {
            const activityName = this.getParameter<string>(interaction, 'name');
            const activityType = this.getParameter<number>(interaction, 'type');
            const status = this.getParameter<string>(interaction, 'status');

            setPresence(client, activityName, activityType, status);

            sendTextReply(interaction, `${CHECK_EMOJI} Presence was set`, true);
        }, () => {
            presenceRatelimitUtil.sendPresenceChangeTimeLeftReply(interaction);
        });
    }
}

const command = new SetPresenceCommand();

export default command;