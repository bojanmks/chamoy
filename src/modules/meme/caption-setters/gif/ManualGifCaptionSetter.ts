const TextOnGif = require("text-on-gif");

class ManualGifCaptionSetter {
    async setCaption(filePath: any, {
        topCaption,
        bottomCaption,
        fontSize
    }: any) {
        let buffer = null;

        const gif = new TextOnGif({
            file_path: filePath,
            font_color: "white",
            font_size: fontSize + "px",
            stroke_width: 5,
            stroke_color: "black"
        });

        if (topCaption) {
            gif.alignment_y = "top";

            buffer = await gif.textOnGif({
                text: topCaption,
                get_as_buffer: !bottomCaption,
                retain: true
            });
        }

        if (bottomCaption) {
            gif.alignment_y = "bottom";

            buffer = await gif.textOnGif({
                text: bottomCaption,
                get_as_buffer: true,
                retain: true
            });
        }

        return {
            file: buffer,
            extension: "gif"
        };
    }
}

export default ManualGifCaptionSetter;