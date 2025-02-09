import { EMBED_COLOR } from "./constants/embedConstants";
import { EmbedBuilder } from "discord.js";

export const makeBaseEmbed = (client: any, title: any) => {
    return new EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setAuthor({
            name: title,
            iconURL: client.user.displayAvatarURL()
        });
}