import useDiscordClient from "@modules/shared/useDiscordClient";

const { getDiscordClient } = useDiscordClient();

const isBotInGuild = (guildId: string) => {
    const client = getDiscordClient();

    if (!client) {
        return false;
    }

    return client.guilds.cache.has(guildId);
}

const useBotGuilds = () => {
    return {
        isBotInGuild
    }
}

export default useBotGuilds;