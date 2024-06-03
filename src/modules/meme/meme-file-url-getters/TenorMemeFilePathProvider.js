const { default: axios } = require("axios");
const cheerio = require("cheerio");

class TenorMemeFilePathProvider {

    message;

    constructor(message) {
        this.message = message;
    }

    async getUrl() {
        const response = await axios.get(this.message.content);
        const html = response.data;

        const $ = cheerio.load(html);

        const metaTag = $(`meta[property='og:image']`);

        const attributeValue = metaTag.attr("content");

        return attributeValue;
    }
}

module.exports = TenorMemeFilePathProvider;