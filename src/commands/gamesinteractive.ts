import useCommands from "@modules/commands/useCommands";
import useErrorReplying from "@modules/errors/useErrorReplying";
import useGameEmbeds from "@modules/games/useGameEmbeds";
import useReplying from "@modules/messaging/useReplying";
import { Client, CommandInteraction } from "discord.js";

const { sendReply } = useReplying();
const { sendGenericErrorReply } = useErrorReplying();
const { makeInteractiveGameEmbed } = useGameEmbeds();
const { BaseCommand } = useCommands();

class GamesInteractiveCommand extends BaseCommand {
    name: string = 'gamesinteractive';
    description: string = 'Get interactive embed with game links';
    
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const response = makeInteractiveGameEmbed(client);

        if (!response) {
            sendGenericErrorReply(interaction);
            return;
        }
        
        await sendReply(interaction, response);
    }
}

const command = new GamesInteractiveCommand();

export default command;