import { getDiscordClient } from "@modules/shared/discordClient";

export const isBotInGuild = (guildId: string) => {
    const client = getDiscordClient();

    if (!client) {
        return false;
    }

    return client.guilds.cache.has(guildId);
}