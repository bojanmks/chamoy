import { ApplicationCommandOptionType, ActivityType, PresenceUpdateStatus, Client, CommandInteraction } from "discord.js";
import { ICommandParameter } from "@modules/commands/models/ICommandParameter";
import BaseCommand from "@modules/commands/models/BaseCommand";
import { sendTextReply } from "@modules/messaging/replying";
import { Emojis } from "@modules/emojis/enums/Emojis";
import { setPresence } from "@modules/presence/presence";
import { onCanChangePresence, sendPresenceChangeTimeLeftReply } from "@modules/presence/presenceRateLimiting";

class SetPresenceCommand extends BaseCommand {
    name: string = 'setpresence';
    description?: string = 'Set bot presence';
    
    override options?: ICommandParameter[] = [
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

    override hasEphemeralResponse?: boolean | undefined = true;

    execute(client: Client, interaction: CommandInteraction): void {
        onCanChangePresence(async () => {
            const activityName = this.getParameter<string>(interaction, 'name');
            const activityType = this.getParameter<number>(interaction, 'type');
            const status = this.getParameter<string>(interaction, 'status');

            setPresence(client, activityName, activityType, status);

            await sendTextReply(interaction, `${Emojis.Check} Presence was set`);
        }, async () => {
            await sendPresenceChangeTimeLeftReply(interaction);
        });
    }
}

const command = new SetPresenceCommand();

export default command;