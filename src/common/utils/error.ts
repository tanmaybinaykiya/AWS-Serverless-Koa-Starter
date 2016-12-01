/// <reference path="../../_all.d.ts" />
"use strict";

export class ServiceError {

    constructor(private name: string, private statusCode: number, private responseBody: any) {
    }
}

export class BadRequestError extends ServiceError {
    constructor(message?: string) {
        let messageBody = {
            "error": (message === undefined || message === null) ? "Invalid input to service" : message
        };
        super("BadRequestError", 400, messageBody);
    }
}

export class NotFoundError extends ServiceError {
    constructor(message?: string) {
        let messageBody = {
            error: (message === undefined || message === null) ? "Resource expired or does not exist" : message
        };
        super("NotFoundError", 404, messageBody);
    }
}

export class UnexpectedFailureError extends ServiceError {
    constructor(message?: string) {
        let messageBody = {
            error: (message === undefined || message === null) ? "Unexpected Failure Condition" : message
        };
        super("Internal Server Error", 500, messageBody);
    }
}

/********* Auth/z Errors ******/

export class AuthenticationError extends ServiceError {
    constructor(message: string) {
        let messageBody = {
            error: (message === undefined || message === null) ? "AuthenticationError" : message
        };
        super("AuthenticationError", 401, messageBody);
    }
}

export class AuthorizationError extends ServiceError {
    constructor(message: string) {
        let messageBody = {
            error: (message === undefined || message === null) ? "AuthorizationError" : message
        };
        super("AuthorizationError", 403, messageBody);
    }
}

/********* Application Errors ******/

export class ApplicationError {
    constructor(public name: string, public body?: any) { }
}

export class InvalidInputError extends ApplicationError {
    constructor(message: string) {
        super(message);
    }
}
