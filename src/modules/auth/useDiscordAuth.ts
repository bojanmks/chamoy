import { Express, Request, Response } from "express";

import { ApplicationUser } from "./models/ApplicationUser";
import { Strategy as DiscordStrategy } from 'passport-discord';
import { RedisStore } from "connect-redis";
import { Roles } from "./enums/Roles";
import passport from "passport";
import session from "express-session";
import useAuthConstants from "./useAuthConstants";
import useBotGuilds from "@modules/guilds/useBotGuilds";
import useEnvironments from "@modules/environments/useEnvironments";
import useRedis from "@lib/redis/useRedis";
import useRefreshTokens from "./useRefreshTokens";
import useUserSessionDataStore from "./useUserSessionDataStore";

const { getRedisClient } = useRedis();
const { DISCORD_AUTH_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } = useAuthConstants();
const { isDevelopment } = useEnvironments();
const { makeRefreshToken, storeRefreshToken, setResponseRefreshTokenCookie, deleteUsersRefreshToken } = useRefreshTokens();
const { storeUserSessionData } = useUserSessionDataStore();
const { isBotInGuild } = useBotGuilds();

const setupDiscordAuth = async (app: Express) => {
    const redisClient = await getRedisClient();
    
    app.use(
        session({
            store: new RedisStore({ client: redisClient }),
            secret: process.env.SESSION_MIDDLEWARE_SECRET_KEY!,
            resave: false,
            saveUninitialized: false,
            name: DISCORD_AUTH_COOKIE_KEY,
            cookie: {
                httpOnly: true,
                secure: !isDevelopment(),
                maxAge: 15 * 60 * 1000, // 15 minutes
                domain: process.env.SESSION_COOKIE_DOMAIN_SETTING,
                path: '/'
            }
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new DiscordStrategy(
            {
                clientID: process.env.CLIENT_ID!,
                clientSecret: process.env.CLIENT_SECRET!,
                callbackURL: `${process.env.SERVER_URL}${process.env.DISCORD_AUTH_CALLBACK_ENDPOINT}`,
                scope: ['identify', 'guilds'],
            },
            async (accessToken, refreshToken, profile, done) => {
                const applicationUserData: ApplicationUser = { ...profile, chamoyRole: Roles.Regular };

                await storeUserSessionData(applicationUserData);

                return done(null, applicationUserData);
            }
        )
    );

    passport.serializeUser((user: Express.User, done) => {
        done(null, user);
    });
        
    passport.deserializeUser((user: Express.User, done) => {
        done(null, user);
    });

    app.get("/api/auth/discord", passport.authenticate("discord"));

    app.get("/api/auth/discord/callback", passport.authenticate("discord", {
        failureRedirect: process.env.FRONTEND_APP_URL
    }),
    async (req, res) => {
        if (!req.user) {
            console.log(`❌ User session wasn't set during discord auth`);
            res.redirect(`${process.env.FRONTEND_APP_URL}/unauthorized/authentication-error`);
            return;
        }

        const user = req.user as ApplicationUser;

        if (!user.guilds?.some(guild => isBotInGuild(guild.id))) {
            await destroyAuthSession(req, res);
            res.redirect(`${process.env.FRONTEND_APP_URL}/unauthorized/no-guilds-in-common`);
            return;
        }

        const userId = user.id;
        const refreshToken = makeRefreshToken();

        await storeRefreshToken(userId, refreshToken);

        setResponseRefreshTokenCookie(res, refreshToken);

        res.redirect(`${process.env.FRONTEND_APP_URL}/unauthorized/discord-authenticate`);
    });
}

const destroyAuthSession = async (req: Request, res: Response) => {
    const userId = (req.user as ApplicationUser)?.id;

    if (userId) {
        await deleteUsersRefreshToken(userId);
    }

    await new Promise((resolve) => {
        req.session.destroy(() => {
            resolve({});
        });
    });

    res.clearCookie(DISCORD_AUTH_COOKIE_KEY);
    res.clearCookie(REFRESH_TOKEN_COOKIE_KEY);
}

export default () => {
    return {
        setupDiscordAuth,
        destroyAuthSession
    }
}