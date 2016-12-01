/// <reference path="../_all.d.ts" />
"use strict";

var cors = require("koa-cors");
var koaBody = require("koa-body");
var jwt = require("koa-jwt");
import * as koa from "koa";
import * as path from "path";
import { eventContext } from "./koa-proxy/middleware";

import { Configuration } from "./utils/config";
/**
 * The server.
 *
 * @class Server
 */
export class Server {

    private app: koa = new koa();
    protected routeMap: Map<String, Function>;

    constructor() {
        this.config();
    }

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     */
    public static bootstrap(): Server {
        return new Server();
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     * @return void
     */
    protected config() {
        console.log("Configuring server....");
        // x-response-time
        this.app.use(function* (next: any) {
            var start = new Date().getTime();
            yield next;
            var ms = new Date().getTime() - start;
            this.set("X-Response-Time", ms + "ms");
        });

        // logger
        this.app.use(function* (next: any) {
            console.log("Request Start: %s %s", this.method, this.url);
            var start = new Date().getTime();
            yield next;
            var ms = new Date().getTime() - start;
            console.log("Request End: %s %s %d - %s ms", this.method, this.url, this.status, ms);
        });
        this.app.use(function* (next: any) {
            try {
                yield next;
            } catch (err) {
                this.status = err.statusCode || 500;
                this.body = err.responseBody || "Unexpected Server error";
                this.app.emit("error", err, this);
            }
        });
        this.app.on("error", function (err: any) {
            console.log("server error", err);
        });
        this.app.use(koaBody());
        this.app.use(cors());
        this.app.use(eventContext());
    }

    public getApp(): koa {
        return this.app;
    }
}
