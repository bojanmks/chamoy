import EzGifGifCaptionSetter from "./gif/EzGifGifCaptionSetter";
import ManualGifCaptionSetter from "./gif/ManualGifCaptionSetter";

class MemeCaptionSetterFactory {
    makeCaptionSetter(data: any) {
        if (data === '.gif') {
            return new EzGifGifCaptionSetter(new ManualGifCaptionSetter());
        }

        return null;
    }
}

export default MemeCaptionSetterFactory;