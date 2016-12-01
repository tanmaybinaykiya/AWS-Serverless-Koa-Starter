/// <reference path="../../_all.d.ts" />
"use strict";
let co = require("co");
import { WowzaHealthCheckService } from "./service";
export function handle(event: any, context: any) {
    co(function* () {
        try {
            let wowzas: any = yield WowzaHealthCheckService.checkForWowzasHealth();
            console.log("Successfully marked all unhealthy wowzas to INACTIVE", wowzas);
            context.succeed(wowzas);
        } catch (err) {
            console.log("Error in wowza health check ", err);
            context.succeed(err);
        }

    });
}