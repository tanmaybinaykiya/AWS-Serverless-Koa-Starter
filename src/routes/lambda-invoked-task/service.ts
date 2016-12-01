/// <reference path="../../_all.d.ts" />
"use strict";

import { WowzaHealthTaskResponse, WowzaHealthTaskExecutor } from "../../common/application/wowza/health";

// https://github.com/Microsoft/TypeScript/issues/5711
import { WowzaDetailsModel } from "../../common/infrastructure/model";

export class WowzaHealthCheckService {

    /**
     * Mark all the wowzas which did not send a heartbeat in last 60secs
     * 
     * @memberOf WowzaHealthCheckService
     */
    public static checkForWowzasHealth = function* () {

        let response: WowzaHealthTaskResponse = yield WowzaHealthTaskExecutor.execute();
        if (response !== null) {
            this.status = 200;
            this.body = response;
        } else {
            this.status = 204;
        }
    };

}


