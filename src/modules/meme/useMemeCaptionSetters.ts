import EzGifGifCaptionSetter from "./captionSetters/gif/EzGifGifCaptionSetter";
import ManualGifCaptionSetter from "./captionSetters/gif/ManualGifCaptionSetter";

class MemeCaptionSetterFactory {
    makeCaptionSetter(data: any) {
        if (data === '.gif') {
            return new EzGifGifCaptionSetter(new ManualGifCaptionSetter());
        }

        return null;
    }
}

export default () => {
    return {
        MemeCaptionSetterFactory
    }
}