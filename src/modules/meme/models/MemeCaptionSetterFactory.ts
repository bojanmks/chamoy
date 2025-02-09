import EzGifGifCaptionSetter from "./captionSetters/gif/EzGifGifCaptionSetter";

class MemeCaptionSetterFactory {
    makeCaptionSetter(data: any) {
        if (data === '.gif') {
            return new EzGifGifCaptionSetter();
        }

        return null;
    }
}

export default MemeCaptionSetterFactory;