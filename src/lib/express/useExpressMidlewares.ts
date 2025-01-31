import { NextFunction, Request, Response } from "express";

const isAuthenticatedMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        await res.status(401).send();
        return;
    }

    next();
};

export default () => {
    return {
        isAuthenticatedMiddleware
    }
}