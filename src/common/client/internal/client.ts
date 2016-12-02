/// <reference path="../../../_all.d.ts" />
"use strict";

import { get, Headers } from "request";
import { IncomingMessage } from "http";

import { Response } from "../../application/dummy/view";

const requestUrl: string = "https://jsonplaceholder.typicode.com/posts/1";

export class InternalClient {

    public static internalPing(): Promise<Response> {

        return new Promise<Response>(function(resolve: (resp: Response) => void, reject: (err: Error) => void) {
            let requestOptions: any = {
                json: true,
                url: requestUrl,
            };
            console.log("client request Options:", requestOptions);
            get(requestOptions, (err, response) => {
                if (err) {
                    console.error("Error in client: ", err);
                    reject(new Error(err.message));
                } else {
                    if (response && response.statusCode / 100 === 2) {
                        console.log("Request succeeded resp: ", response.body);
                        resolve(new Response(response.body));
                    } else {
                        console.error("Unexpected response code", response.statusCode, response.statusMessage);
                        reject(new Error("Unexpected response code: " + response.statusCode));
                    }
                }
            });

        });

    }

}