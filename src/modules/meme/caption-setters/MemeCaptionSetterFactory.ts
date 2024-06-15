const EzGifGifCaptionSetter = require("./gif/EzGifGifCaptionSetter");
const ManualGifCaptionSetter = require("./gif/ManualGifCaptionSetter");

class MemeCaptionSetterFactory {
    makeCaptionSetter(data) {
        if (data === '.gif') {
            return new EzGifGifCaptionSetter(new ManualGifCaptionSetter());
        }

        return null;
    }
}

module.exports = MemeCaptionSetterFactory;