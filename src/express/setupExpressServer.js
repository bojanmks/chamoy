const SERVER_PORT = 25738;
const API_PREFIX = "/api";

const path = require('path');
const getAllFiles = require('@util/getAllFiles');
const express = require('express');
const getFileNameFromPath = require('@util/getFileNameFromPath');
const { UNEXPECTED_ERROR_API_RESPONSE } = require('@modules/errors/messages/errorMessages');
const { USER_ERROR, SUCCESS, SERVER_ERROR } = require('@modules/shared/constants/statusCodes');
const app = express();

module.exports = () => {
    const controllerFilePaths = getAllFiles(path.join(__dirname, "controllers"));

    for (const controllerFilePath of controllerFilePaths) {
        const controllerFileName = getFileNameFromPath(controllerFilePath);

        const controllerNameEndIndex = controllerFileName.indexOf("Controller");
        const controllerName = controllerFileName.substring(0, controllerNameEndIndex);
        const controllerBaseRoute = `${API_PREFIX}/${controllerName}`;

        const controllerEndpoints = require(controllerFilePath);

        for (const endpointObject of Object.values(controllerEndpoints)) {
            registerEndpoint(endpointObject, controllerBaseRoute);
        }
    }

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

    app[endpointObject.method](baseRoute + endpointObject.route, (req, res, next) => {
        handleEndpointCallback(endpointObject, req, res, next);
    });
}

function handleEndpointCallback(endpointObject, req, res, next) {
    try {
        if (endpointObject.validator) {
            const validationResult = endpointObject.validator(req, res, next);
    
            if (!validationResult.isValid) {
                res.send(generateValidationError(validationResult));
                return;
            }
        }
    
        const response = endpointObject.callback(req, res, next);
        res.send({
            statusCode: SUCCESS,
            data: response
        });
    }
    catch {
        res.send({
            statusCode: SERVER_ERROR,
            message: UNEXPECTED_ERROR_API_RESPONSE
        });
    }
}

function generateValidationError(validationResult) {
    const response = {
        statusCode: validationResult.statusCode ? validationResult.statusCode : USER_ERROR,
        data: {
            validationMessages: validationResult.messages
        }
    };
    
    return response;
}