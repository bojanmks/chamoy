const { EmbedBuilder } = require("discord.js");
const { EMBED_COLOR } = require("@modules/shared/constants/constants");

module.exports = (client, title) => {
    return new EmbedBuilder()
        .setColor(`${EMBED_COLOR}`)
        .setAuthor({
            name: title,
            iconURL: client.user.displayAvatarURL()
        });
};