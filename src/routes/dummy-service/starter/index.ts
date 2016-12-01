//TODO do not run this, this is just to copy as index to functions folder on compile
/// <reference path="../../../_all.d.ts" />
"use strict";
const starterClass = require("./common/starter").Starter;
const app = require("./routes/dummy-service/app").app;
var starter = new starterClass(app, "dummy-service");
exports.handle = starter.handle;