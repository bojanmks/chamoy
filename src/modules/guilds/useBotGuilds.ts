import { Client } from "discord.js";
import UserGuild from "@modules/auth/models/UserGuild";

const guildCacheMap = new Map<string, UserGuild>();

const isBotInGuild = (guildId: string) => {
    return guildCacheMap.has(guildId);
}

const refreshGuildsCache = (client: Client) => {
    guildCacheMap.clear();

    for (const guild of client.guilds.cache.map(g => g)) {
        guildCacheMap.set(guild.id, {
            id: guild.id,
            name: guild.name,
            icon: guild.icon
        });
    }
}

const useBotGuilds = () => {
    return {
        isBotInGuild,
        refreshGuildsCache
    }
}

export default useBotGuilds;