import { default as axios } from "axios";

const cheerio = require("cheerio");

class TenorMemeFilePathProvider {

    message;

    constructor(message: any) {
        this.message = message;
    }

    async getUrl() {
        const response = await axios.get(this.message.content);
        const html = response.data;

        const $ = cheerio.load(html);

        const metaTag = $(`meta[itemprop='contentUrl']`);
        const path = metaTag.attr('content');

        return path;
    }
}

export default TenorMemeFilePathProvider;