import BaseCommand from "@modules/commands/models/BaseCommand";
import { sendGenericErrorReply } from "@modules/errors/errorReplying";
import { makeInteractiveGameEmbed } from "@modules/games/gameEmbeds";
import { sendReply } from "@modules/messaging/replying";
import { Client, CommandInteraction } from "discord.js";

class GamesInteractiveCommand extends BaseCommand {
    name: string = 'gamesinteractive';
    description: string = 'Get interactive embed with game links';
    
    override hasEphemeralParameter?: boolean | undefined = true;
    override ephemeralParameterDefaultValue?: boolean | undefined = false;

    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const response = await makeInteractiveGameEmbed(client);

        if (!response) {
            await sendGenericErrorReply(interaction);
            return;
        }
        
        await sendReply(interaction, { ...response });
    }
}

const command = new GamesInteractiveCommand();

export default command;