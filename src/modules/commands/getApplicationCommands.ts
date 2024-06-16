import { ApplicationCommand, ApplicationCommandManager, Client, GuildResolvable } from "discord.js";

export default async (client: Client): Promise<ApplicationCommandManager<ApplicationCommand<{guild: GuildResolvable}>, {guild: GuildResolvable}, null> | undefined> => {
    let applicationCommands = await client.application?.commands;
    await applicationCommands?.fetch();
    
    return applicationCommands;
};