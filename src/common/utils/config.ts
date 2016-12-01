/// <reference path="../../_all.d.ts" />
"use strict";

import { config } from "dotenv";
config();

export class Configuration {
    public static readonly serviceName: string = process.env.SERVERLESS_SERVICE_NAME;
    public static readonly isLocalDeployment: boolean = process.env.SMG_LOCAL;
    public static readonly deployedRegion: string = process.env.SERVERLESS_REGION;
    public static readonly deployedStage: string = process.env.SERVERLESS_STAGE;
    public static readonly aws = {
        ddb: {
            profileName: "aws-ddb-profile",
            localEndpoint: process.env.LOCAL_DYNAMO
        },
        stage: Configuration.deployedStage,
        region: Configuration.deployedRegion,
    };
}
