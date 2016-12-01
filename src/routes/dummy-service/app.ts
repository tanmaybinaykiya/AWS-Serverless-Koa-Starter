/// <reference path="../../_all.d.ts" />
"use strict";

let routerClass = require("koa-better-router");
let router = routerClass().loadMethods();
let dummyApi = routerClass({ prefix: "/dummy" });

import { Server } from "../../common/app";
import { DummyService } from "./service";

class DummyServer extends Server {
    constructor() {
        super();
        this.routes();
    }
    public static bootstrap(): DummyServer {
        return new DummyServer();
    }
    private routes() {
        router.get("/ping/:name", DummyService.ping);
        router.get("/internal/ping", DummyService.internalPing);
        dummyApi.extend(router);
        super.getApp().use(dummyApi.legacyMiddleware());
    }

}

var server = DummyServer.bootstrap();
exports.app = server.getApp();