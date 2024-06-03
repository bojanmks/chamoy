const TenorMemeFilePathProvider = require("./TenorMemeFilePathProvider");

class MemeFilePathProviderFactory {
    message;

    constructor(message) {
        this.message = message;
    }

    makePathProvider() {
        const messageContent = this.message.content;
        const urlRegex = /(https?:\/\/[^\s]+)/;
        const isUrl = messageContent.match(urlRegex);

        if (!isUrl) {
            return null;
        }

        if (messageContent.includes('tenor.com')) {
            return new TenorMemeFilePathProvider(this.message);
        }

        return null;
    }
}

module.exports = MemeFilePathProviderFactory;