export default async (client: any) => {
    let applicationCommands = await client.application.commands;
    await applicationCommands.fetch();
    
    return applicationCommands;
};