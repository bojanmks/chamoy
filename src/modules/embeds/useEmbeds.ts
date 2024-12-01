import { EmbedBuilder } from "discord.js";
import useEmbedConstants from "./useEmbedConstants";

const { EMBED_COLOR } = useEmbedConstants();

const makeBaseEmbed = (client: any, title: any) => {
    return new EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setAuthor({
            name: title,
            iconURL: client.user.displayAvatarURL()
        });
}

export default () => {
    return {
        makeBaseEmbed
    }
}