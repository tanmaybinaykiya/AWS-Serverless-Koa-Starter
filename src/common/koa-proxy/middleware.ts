/// <reference path="../../_all.d.ts" />
"use strict";

export function eventContext(options?: any) {

    return function* (next: any) {
        options = options || {}; // defaults: {reqPropKey: "apiGateway", deleteHeaders: true}
        this.state = this.state || {};
        const reqPropKey = options.reqPropKey || "apiGateway";
        const deleteHeaders = options.deleteHeaders === undefined ? true : options.deleteHeaders;
        let req = this.request;
        if (!req.headers["x-apigateway-event"] || !req.headers["x-apigateway-context"]) {
            console.error("Missing x-apigateway-event or x-apigateway-context header(s)");
            yield next;
        } else {
            this.state[reqPropKey] = {
                event: JSON.parse(req.headers["x-apigateway-event"]),
                context: JSON.parse(req.headers["x-apigateway-context"])
            };

            if (deleteHeaders) {
                delete req.headers["x-apigateway-event"];
                delete req.headers["x-apigateway-context"];
            }
            yield next;
        }
    };

};
