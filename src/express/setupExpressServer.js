const SERVER_PORT = process.env.EXPRESS_SERVER_PORT;
const API_PREFIX = "/api";

const path = require('path');
const getAllFiles = require('@util/getAllFiles');
const express = require('express');
const { UNEXPECTED_ERROR_API_RESPONSE } = require('@modules/errors/messages/errorMessages');
const { USER_ERROR, SUCCESS, SERVER_ERROR, NOT_FOUND } = require('@modules/shared/constants/statusCodes');
const app = express();

module.exports = () => {
    const controllerFilePaths = getAllFiles(path.join(__dirname, "controllers"));

    for (const controllerFilePath of controllerFilePaths) {
        const controllerFileName = path.basename(controllerFilePath);

        const controllerNameEndIndex = controllerFileName.indexOf("Controller");
        const controllerName = controllerFileName.substring(0, controllerNameEndIndex);
        const controllerBaseRoute = `${API_PREFIX}/${controllerName}`;

        const controllerEndpoints = require(controllerFilePath);

        for (const endpointObject of Object.values(controllerEndpoints)) {
            registerEndpoint(endpointObject, controllerBaseRoute);
        }
    }

    app.all("*", (req, res) => {
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

function registerEndpoint(endpointObject, baseRoute) {
    if (!endpointObject.method || !ALLOWED_METHODS.includes(endpointObject.method.toLowerCase())) {
        endpointObject.method = DEFAULT_METHOD;
    }

    endpointObject.method = endpointObject.method.toLowerCase();

    const fullRoute = baseRoute + endpointObject.route;

    app[endpointObject.method](fullRoute, (req, res, next) => {
        handleEndpointCallback(endpointObject, req, res, next);
    });

    console.log(`🔗 Registered route: ${endpointObject.method.toUpperCase()} ${fullRoute}`);
}

function handleEndpointCallback(endpointObject, req, res, next) {
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
    
        const response = endpointObject.callback(req, res, next);

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

function generateValidationResponse(validationResult) {
    return {
        statusCode: validationResult.statusCode ? validationResult.statusCode : USER_ERROR,
        data: {
            validationMessages: validationResult.messages
        }
    };
}