const { EmbedBuilder } = require("discord.js");
const { EMBED_COLOR } = require("../../constants/constants");

module.exports = () => {
    return new EmbedBuilder()
        .setColor(`${EMBED_COLOR}`);
};