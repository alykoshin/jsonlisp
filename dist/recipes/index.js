"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const sequential_1 = require("./sequential");
const parallel_1 = require("./parallel");
const echo_1 = require("./echo");
const sleep_1 = require("./sleep");
const exec_1 = require("./exec");
const build_1 = require("./build");
const version_1 = require("./version");
const zip_1 = require("./zip");
const yarnInstallProd_1 = require("./yarnInstallProd");
// export type ActionArrayDefinition = [
//
// ];
const action = {
    action: 'yarnInstallProd',
    config: {}
};
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