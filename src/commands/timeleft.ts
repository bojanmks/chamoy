import { BaseCommand } from '@modules/commands/models/BaseCommand';
import getDaysLeft from '@modules/usernameDecrement/getDaysLeft';
import getSavedUsername from '@modules/usernameDecrement/getSavedUsername';
import sendDaysLeftMessage from '@modules/usernameDecrement/messages/sendDaysLeftMessage';
import { Client, CommandInteraction } from 'discord.js';

class TimeleftCommand extends BaseCommand {
    name: string = 'timeleft';
    description: string | null = 'Returns time left in days';
    override deleted: boolean = true;
    
    execute(client: Client, interaction: CommandInteraction): void {
        const username = getSavedUsername();
        const daysLeft = getDaysLeft(username);

        sendDaysLeftMessage(daysLeft, interaction);
    }
}

const command = new TimeleftCommand();

export default command;