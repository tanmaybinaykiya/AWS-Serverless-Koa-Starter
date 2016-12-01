/// <reference path="../../_all.d.ts" />
"use strict";

import {
    Helper, Request, Response
} from "../../common/application/dummy";
import { Configuration } from "../../common/utils/config";

export class DummyService {

    /**
     * @apiName Ping Service
     * @apiGroup Ping Service
     * @api {get} /ping/:name Ping
     * @apiDescription Invokes Ping with a name 
     *
     * @apiParam (Path parameters) {String} name Some string 

     * @apiSuccess (200) None Request Succeeded
     * @apiError (400) BadRequest BadRequest
     * @apiError (500) InternalServerError Internal Server Error
     * 
     */
    public static ping = function* (): any {

        let request: Request = new Request(this.params.name);
        let response: Response = yield Helper.ping(request);
        if (response !== null) {
            this.status = 200;
            this.body = response;
        } else {
            this.status = 204;
        }
    };


    public static internalPing = function* (): any {
        let response: Response = yield Helper.internalPing();
        if (response !== null) {
            this.status = 200;
            this.body = response;
        } else {
            this.status = 204;
        }
    };

}
