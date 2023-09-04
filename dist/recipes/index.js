"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
var sequential_1 = require("./sequential");
var parallel_1 = require("./parallel");
var echo_1 = require("./echo");
var sleep_1 = require("./sleep");
var exec_1 = require("./exec");
var build_1 = require("./build");
var version_1 = require("./version");
var zip_1 = require("./zip");
var yarnInstallProd_1 = require("./yarnInstallProd");
// export type ActionArrayDefinition = [
//
// ];
//
// interface Actions {
//   [key: string]: ActionMethod
// }
exports.actions /*: Actions */ = {
    sequential: sequential_1.action_sequential,
    parallel: parallel_1.action_parallel,
    echo: echo_1.action_echo,
    sleep: sleep_1.action_sleep,
    exec: exec_1.action_exec,
    build: build_1.action_build,
    yarnInstallProd: yarnInstallProd_1.action_yarnInstallProd,
    version: version_1.action_version,
    zip: zip_1.action_zip,
};
// type ActionKeys = keyof typeof actions
//# sourceMappingURL=index.js.map