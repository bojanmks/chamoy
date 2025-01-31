const DISCORD_AUTH_COOKIE_KEY = 'discord.oauth2';
const REFRESH_TOKEN_COOKIE_KEY = 'chamoy.refreshToken';
const REFRESH_TOKEN_EXPIRATION_IN_SECONDS = 30 * 24 * 60 * 60; // 30 days

export default () => {
    return {
        DISCORD_AUTH_COOKIE_KEY,
        REFRESH_TOKEN_COOKIE_KEY,
        REFRESH_TOKEN_EXPIRATION_IN_SECONDS
    }
}