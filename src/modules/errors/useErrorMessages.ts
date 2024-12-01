import useEmojis from "@modules/emojis/useEmojis";

const { X_EMOJI } = useEmojis();

const GENERIC_ERROR_RESPONSE = `${X_EMOJI} An error occured`;
const NO_PERMISSION_ERROR_RESPONSE = `${X_EMOJI} No permission`;
const BOT_IS_BUSY_ERROR_RESPONSE = `${X_EMOJI} Bot is busy`;
const UNEXPECTED_ERROR_API_RESPONSE = "An unexpected error occured.";

export default () => {
    return {
        GENERIC_ERROR_RESPONSE,
        NO_PERMISSION_ERROR_RESPONSE,
        BOT_IS_BUSY_ERROR_RESPONSE,
        UNEXPECTED_ERROR_API_RESPONSE
    }
}