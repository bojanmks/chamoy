import useFiles from '@modules/files/useFiles';
import express from 'express';
import path from 'path';
import { ActionResultStatus, Endpoint } from './endpoints/Endpoint';

const app = express();
const PORT = process.env.EXPRESS_PORT

const { getContentsOfDirectory, getObjectsFromFilesInPath } = useFiles();

const startExpressServer = (): Promise<void> => {
    return new Promise(async resolve => {
        const endpointFolders = getContentsOfDirectory(path.join(__dirname, 'endpoints'), true);

        for (const folder of endpointFolders) {
            const endpoints: Endpoint[] = await getObjectsFromFilesInPath(folder);

            for (const endpoint of endpoints) {
                app[endpoint.method](`/api/${endpoint.route}`, async (req, res) => {
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
    
                        const endpointResult = await endpoint.handler(req);
    
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
                        }
                    }
                    catch (error) {
                        console.error(`❌ Error handling the request on the ${endpoint.method.toUpperCase()} /api/${endpoint.route} endpoint`);
                        console.error(error);
                        await res.status(500).send();
                    }
                });

                console.log(`🔗 Registered route ${endpoint.method.toUpperCase()} /api/${endpoint.route}`);
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