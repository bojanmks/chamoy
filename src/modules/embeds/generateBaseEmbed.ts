import { EmbedBuilder } from "discord.js";
import { EMBED_COLOR } from "@modules/shared/constants/constants";

export default (client: any, title: any) => {
    return new EmbedBuilder()
        .setColor(`${EMBED_COLOR}`)
        .setAuthor({
            name: title,
            iconURL: client.user.displayAvatarURL()
        });
};