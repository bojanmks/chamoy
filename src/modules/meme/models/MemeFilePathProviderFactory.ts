import TenorMemeFilePathProvider from "./memeFileUrlProviders/TenorMemeFilePathProvider";

class MemeFilePathProviderFactory {
    message;

    constructor(message: any) {
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

export default MemeFilePathProviderFactory;