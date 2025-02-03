import { ApplicationUser } from "./models/ApplicationUser";
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Express } from "express";
import { RedisStore } from "connect-redis";
import { Roles } from "./enums/Roles";
import passport from "passport";
import session from "express-session";
import useAuthConstants from "./useAuthConstants";
import useEnvironments from "@modules/environments/useEnvironments";
import useRedis from "@lib/redis/useRedis";
import useRefreshTokens from "./useRefreshTokens";
import useUserSessionDataStore from "./useUserSessionDataStore";

const { getRedisClient } = useRedis();
const { DISCORD_AUTH_COOKIE_KEY } = useAuthConstants();
const { isDevelopment } = useEnvironments();
const { makeRefreshToken, storeRefreshToken, setResponseRefreshTokenCookie } = useRefreshTokens();
const { storeUserSessionData } = useUserSessionDataStore();

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
                maxAge: 15 * 60 * 1000 // 15 minutes
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
        
    passport.deserializeUser((obj: Express.User, done) => {
        done(null, obj);
    });

    app.get("/api/auth/discord", passport.authenticate("discord"));

    app.get("/api/auth/discord/callback", passport.authenticate("discord", {
        failureRedirect: process.env.FRONTEND_APP_URL
    }),
    async (req, res) => {
        const redirect = () => {
            res.redirect(`${process.env.FRONTEND_APP_URL}/unauthorized/discord-authenticate`);
        }

        if (!req.user) {
            console.log(`❌ User session wasn't set during discord auth`);
            redirect();
            return;
        }

        const userId = (req.user as ApplicationUser).id;
        const refreshToken = makeRefreshToken();

        await storeRefreshToken(userId, refreshToken);

        setResponseRefreshTokenCookie(res, refreshToken);

        redirect();
    });
}

export default () => {
    return {
        setupDiscordAuth
    }
}