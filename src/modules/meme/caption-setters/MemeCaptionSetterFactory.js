const GifCaptionSetter = require("./GifCaptionSetter");

class MemeCaptionSetterFactory {
    makeCaptionSetter(data) {
        if (data === '.gif') {
            return new GifCaptionSetter();
        }

        return null;
    }
}

module.exports = MemeCaptionSetterFactory;