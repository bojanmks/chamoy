import { NextFunction, Request, Response } from "express";

import { ApplicationUser } from "@modules/auth/models/ApplicationUser";
import { isBotInGuild } from "@modules/guilds/botGuilds";

export const isAuthenticatedMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        await res.status(401).send();
        return;
    }

    next();
};

export const isUserInAnyBotGuildMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as ApplicationUser;

    if (!user?.guilds?.some(guild => isBotInGuild(guild.id))) {
        await res.status(403).send();
        return;
    }

    next();
};