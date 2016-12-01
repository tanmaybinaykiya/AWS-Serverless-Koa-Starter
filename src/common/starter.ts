/// <reference path="../_all.d.ts" />
"use strict";

import { Proxy } from "./koa-proxy/index";
import * as koa from "koa";
var server;
export class Starter {
    private static proxy: Proxy;

    constructor(app: koa, serviceName: string) {
        Starter.proxy = new Proxy(serviceName);
        server = Starter.proxy.createServer(app.callback(), null);
        Starter.proxy.startServer(server);
    }
    public handle(event: any, context: any) {
        if (event.headers) {
            Starter.proxy.proxy(server, event, context, null);
        } else {
            context.succeed();
        }
    }
}