import path from 'path';
import getAllFiles from '@util/getAllFiles';
import express from 'express';
import cors from 'cors';
import { UNEXPECTED_ERROR_API_RESPONSE } from '@modules/errors/messages/errorMessages';
import { USER_ERROR, SUCCESS, SERVER_ERROR, NOT_FOUND } from '@modules/shared/constants/statusCodes';

const SERVER_PORT = process.env.EXPRESS_SERVER_PORT;
const API_PREFIX = "/api";

const app = express();
app.use(cors());

export default (client: any) => {
    const controllerFilePaths = getAllFiles(path.join(__dirname, "controllers"));

    for (const controllerFilePath of controllerFilePaths) {
        const controllerFileName = path.basename(controllerFilePath);

        const controllerNameEndIndex = controllerFileName.indexOf("Controller");
        const controllerName = controllerFileName.substring(0, controllerNameEndIndex);
        const controllerBaseRoute = `${API_PREFIX}/${controllerName}`;

        const controllerEndpoints = require(controllerFilePath);

        for (const endpointObject of Object.values(controllerEndpoints)) {
            registerEndpoint(endpointObject, controllerBaseRoute, client);
        }
    }

    app.all("*", (req: any, res: any) => {
        res.status(NOT_FOUND);
        res.send({
            statusCode: NOT_FOUND
        });
    });

    app.listen(SERVER_PORT, () => {
        console.log(`✅ Express server is listening to port ${SERVER_PORT}`);
    });
};

const ALLOWED_METHODS = ["get", "post", "put", "delete"];
const DEFAULT_METHOD = "get";

function registerEndpoint(endpointObject: any, baseRoute: any, client: any) {
    if (!endpointObject.method || !ALLOWED_METHODS.includes(endpointObject.method.toLowerCase())) {
        endpointObject.method = DEFAULT_METHOD;
    }

    endpointObject.method = endpointObject.method.toLowerCase();

    const fullRoute = baseRoute + endpointObject.route;
    const methodToInvoke: string = endpointObject.method;

    switch (endpointObject.method) {
        case 'get':
            app.get(fullRoute, async (req: any, res: any, next: any) => {
                await handleEndpointCallback(endpointObject, req, res, next, client);
            });
            break;

        case 'post':
            app.post(fullRoute, async (req: any, res: any, next: any) => {
                await handleEndpointCallback(endpointObject, req, res, next, client);
            });
            break;

        case 'put':
            app.put(fullRoute, async (req: any, res: any, next: any) => {
                await handleEndpointCallback(endpointObject, req, res, next, client);
            });
            break;

        case 'delete':
            app.delete(fullRoute, async (req: any, res: any, next: any) => {
                await handleEndpointCallback(endpointObject, req, res, next, client);
            });
            break;
    }

    console.log(`🔗 Registered route: ${endpointObject.method.toUpperCase()} ${fullRoute}`);
}

async function handleEndpointCallback(endpointObject: any, req: any, res: any, next: any, client: any) {
    try {
        if (endpointObject.validator) {
            const validationResult = endpointObject.validator(req, res, next);
    
            if (!validationResult.isValid) {
                const validationResponse = generateValidationResponse(validationResult);
                res.status(validationResponse.statusCode);
                res.send(validationResponse);
                return;
            }
        }
    
        const response = await endpointObject.callback(req, res, next, client);

        res.status(SUCCESS);
        res.send({
            statusCode: SUCCESS,
            data: response
        });
    }
    catch {
        res.status(SERVER_ERROR);
        res.send({
            statusCode: SERVER_ERROR,
            message: UNEXPECTED_ERROR_API_RESPONSE
        });
    }
}

function generateValidationResponse(validationResult: any) {
    return {
        statusCode: validationResult.statusCode ? validationResult.statusCode : USER_ERROR,
        data: {
            validationMessages: validationResult.messages
        }
    };
}