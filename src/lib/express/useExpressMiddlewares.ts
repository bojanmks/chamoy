import { NextFunction, Request, Response } from "express";

import { ApplicationUser } from "@modules/auth/models/ApplicationUser";
import useBotGuilds from "@modules/guilds/useBotGuilds";

const isAuthenticatedMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        await res.status(401).send();
        return;
    }

    next();
};

const { isBotInGuild } = useBotGuilds();

const isUserInAnyBotGuildMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as ApplicationUser;

    if (!user?.guilds?.some(guild => isBotInGuild(guild.id))) {
        await res.status(403).send();
        return;
    }

    next();
};

export default () => {
    return {
        isAuthenticatedMiddleware,
        isUserInAnyBotGuildMiddleware
    }
}