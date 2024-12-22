import { Request } from "express";

export interface ActionResult<T> {
    status: ActionResultStatus;
    result?: T;
    errors?: string[];
}

export enum ActionResultStatus {
    Success = 1,
    Error = 2,
    ValidationError = 3,
    NotFound = 4
}

export interface EndpointValidatorResult {
    isValid: boolean,
    errors?: string[]
}

export interface Endpoint {
    route: string;
    method: 'get' | 'post' | 'put' | 'delete';
    validator?: (req: Request) => Promise<EndpointValidatorResult> | EndpointValidatorResult;
    handler: (req: Request) => Promise<ActionResult<any>> | ActionResult<any>;
}