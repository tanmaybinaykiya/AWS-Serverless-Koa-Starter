/// <reference path="../../_all.d.ts" />
"use strict";

import * as http from "http";
import { Configuration } from "../utils/config";

export class Proxy {
    socketPathPrefix: string;

    constructor(socketPathPrefix: string) {
        this.socketPathPrefix = socketPathPrefix || "server";
    }
    public startServer(server: any) {
        let socPath = this.getSocketPath(server._socketPathSuffix);
        console.log("Listening on socket path " + socPath);
        return server.listen(socPath);
    }

    public getSocketPath(socketPathSuffix: any) {
        return `/tmp/server-${this.socketPathPrefix}-${socketPathSuffix}.sock`;
    }
    public createServer = (requestListener: any, serverListenCallback: any) => {
        const server: any = http.createServer(requestListener);

        server._socketPathSuffix = 0;
        server.on("listening", () => {
            server._isListening = true;
            if (serverListenCallback) {
                serverListenCallback();
            }
        });
        server.on("close", () => {
            server._isListening = false;
        })
            .on("error", (err) => {
                if (err.code === "EADDRINUSE") {
                    console.warn(`EADDRINUSE ${this.getSocketPath(server._socketPathSuffix)} incrementing socketPathSuffix.`);
                    ++server._socketPathSuffix;
                    server.close(() => this.startServer(server));
                }
            });

        return server;
    }

    public proxy = (server: any, event: any, context: any, callback: any) => {
        if (server._isListening) {
            this.forwardRequestToNodeServer(server, event, context, callback);
        } else {
            this.startServer(server)
                .on("listening", () => this.forwardRequestToNodeServer(server, event, context, callback));
        }
    }
    private removeStageFromPath(path: string): string {
        if (path) {
            var pathParts = path.split("/");
            var index = pathParts.indexOf(Configuration.deployedStage);
            if (index < 0) {
                return path;
            }
            pathParts = pathParts.splice(index + 1, pathParts.length);
            return "/" + pathParts.join("/");
        }
        return path;
    }
    private getPathWithQueryStringParams(event: any) {
        var transformedPath = this.removeStageFromPath(event.path);
        const queryStringKeys = Object.keys(event.queryStringParameters || {});
        if (queryStringKeys.length === 0) {
            return transformedPath;
        };
        const queryStringParams = queryStringKeys.map(queryStringKey => `${queryStringKey}=${event.queryStringParameters[queryStringKey]}`).join("&");

        return `${transformedPath}?${queryStringParams}`;
    }

    private mapApiGatewayEventToHttpRequest(event: any, context: any, socketPath: any) {
        event.headers["x-apigateway-event"] = JSON.stringify(event);
        event.headers["x-apigateway-context"] = JSON.stringify(context);
        return {
            method: event.httpMethod,
            path: this.getPathWithQueryStringParams(event),
            headers: event.headers,
            socketPath: socketPath
            // protocol: `${event.headers["X-Forwarded-Proto"]}:`,
            // host: event.headers.Host,
            // hostname: event.headers.Host, // Alias for host
            // port: event.headers["X-Forwarded-Port"]
        };
    }

    private forwardResponseToApiGateway(server: any, response: any, context: any, callback: any) {
        let body = "";
        response.setEncoding("utf8")
            .on("data", (chunk) => body += chunk.toString("utf8"))
            .on("end", () => {
                const statusCode = response.statusCode;
                const headers = response.headers;

                Object.keys(headers)
                    .forEach(h => {
                        if (Array.isArray(headers[h])) {
                            headers[h] = headers[h].join(",");
                        }
                    });
                const successResponse = { statusCode, body, headers };
                if (callback) {
                    callback(successResponse);
                } else {
                    context.succeed(successResponse);
                }
            });
    }

    private forwardConnectionErrorResponseToApiGateway(server: any, error: any, context: any, callback: any) {
        // if debug: console.log(error)
        const errorResponse = {
            statusCode: 502, // "DNS resolution, TCP level errors, or actual HTTP parse errors" - https://nodejs.org/api/http.html#http_http_request_options_callback
            body: "",
            headers: {}
        };
        if (callback) {
            callback(errorResponse);
        } else {
            context.succeed(errorResponse);
        }
    }

    private forwardRequestToNodeServer(server: any, event: any, context: any, callback: any) {
        const requestOptions = this.mapApiGatewayEventToHttpRequest(event, context, this.getSocketPath(server._socketPathSuffix));
        const req = http.request(requestOptions, (response) => this.forwardResponseToApiGateway(server, response, context, callback));
        if (event.body) {
            req.write(event.body);
        }
        req.on("error", (error) => this.forwardConnectionErrorResponseToApiGateway(server, error, context, callback))
            .end();
    }
}

