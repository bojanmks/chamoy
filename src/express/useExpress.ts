const cookieParser = require("cookie-parser");

import { ActionResultStatus, Endpoint } from './endpoints/Endpoint';

import cors from 'cors';
import express from 'express';
import path from 'path';
import useDiscordAuth from '@modules/auth/useDiscordAuth';
import useEnvironments from '@modules/environments/useEnvironments';
import useExpressMidlewares from '@lib/express/useExpressMidlewares';
import useFiles from '@modules/files/useFiles';

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_APP_URL,
        credentials: true
    })
);

app.use(cookieParser());

const PORT = process.env.EXPRESS_PORT;

const { getContentsOfDirectory, getObjectsFromFilesInPath } = useFiles();
const { setupDiscordAuth } = useDiscordAuth();
const { isAuthenticatedMiddleware } = useExpressMidlewares();
const { isDevelopment } = useEnvironments();

if (!isDevelopment()) {
    app.set("trust proxy", 1);
}

const startExpressServer = (): Promise<void> => {
    return new Promise(async resolve => {
        await setupDiscordAuth(app);

        const endpointFolders = getContentsOfDirectory(path.join(__dirname, 'endpoints'), true);

        for (const folder of endpointFolders) {
            const endpoints: Endpoint[] = await getObjectsFromFilesInPath(folder);

            for (const endpoint of endpoints) {
                const routeMiddlewares = endpoint.doNotAuthorize ? [] : [isAuthenticatedMiddleware];

                app[endpoint.method](`/api${endpoint.route}`, ...routeMiddlewares, async (req, res) => {
                    try {
                        if (endpoint.validator) {
                            const validationResult = await endpoint.validator(req);
    
                            if (!validationResult.isValid) {
                                res.status(422).send({
                                    errors: validationResult.errors
                                });
                                return;
                            }
                        }
    
                        const endpointResult = await endpoint.handler(req, res);
    
                        switch (endpointResult.status) {
                            case ActionResultStatus.Success:
                                await res.status(200).send({
                                    result: endpointResult.result
                                });
                                break;
    
                            case ActionResultStatus.Error:
                                await res.status(400).send({
                                    errors: endpointResult.errors
                                });
                                break;
    
                            case ActionResultStatus.ValidationError:
                                await res.status(422).send({
                                    errors: endpointResult.errors
                                });
                                break;
    
                            case ActionResultStatus.NotFound:
                                await res.status(404).send({
                                    errors: endpointResult.errors
                                });
                                break;

                            case ActionResultStatus.Forbidden:
                                await res.status(403).send({
                                    errors: endpointResult.errors
                                });
                                break;

                            case ActionResultStatus.Unauthorized:
                                await res.status(401).send({
                                    errors: endpointResult.errors
                                });
                                break;
                        }
                    }
                    catch (error) {
                        console.error(`❌ Error handling the request on the ${endpoint.method.toUpperCase()} /api${endpoint.route} endpoint`);
                        console.error(error);
                        await res.status(500).send();
                    }
                });

                console.log(`🔗 Registered route ${endpoint.method.toUpperCase()} /api${endpoint.route}`);
            }
        }

        app.listen(PORT, () => {
            console.log(`✅ Express server listening on port ${PORT}`);
            resolve();
        });
    });
}

export default () => {
    return {
        startExpressServer
    }
}