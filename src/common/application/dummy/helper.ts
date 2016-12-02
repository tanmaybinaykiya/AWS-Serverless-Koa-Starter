/// <reference path="../../../_all.d.ts" />
"use strict";

import { Configuration } from "../../utils/config";
import { Request, Response } from "./view";
import { BadRequestError, UnexpectedFailureError, AuthenticationError } from "../../utils/error";
import { InternalClient } from "../../client/internal";

export class Helper {

    public static * ping(request: Request) {
        if (request.isValid()) {
            yield InternalClient.internalPing();
            return new Response("Success: " + request.getName());
        } else {
            throw new BadRequestError();
        }
    };

    public static * internalPing() {
        return new Response("Success: " + new Date().getTime());
    };

}
