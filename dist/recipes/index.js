"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const sequential_1 = require("./sequential");
const parallel_1 = require("./parallel");
const echo_1 = require("./echo");
const cleanup_1 = require("./cleanup");
const cp_1 = require("./cp");
const copyResourcesRecursive_1 = require("./copyResourcesRecursive");
const rm_1 = require("./rm");
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
// interface Actions {
//   [key: string]: ActionMethod
// }
exports.actions /*: Actions */ = {
    build: build_1.action_build,
    cleanup: cleanup_1.action_cleanup,
    cp: cp_1.action_cp,
    copyResourcesRecursive: copyResourcesRecursive_1.action_copyResourcesRecursive,
    echo: echo_1.action_echo,
    exec: exec_1.action_exec,
    parallel: parallel_1.action_parallel,
    rm: rm_1.action_rm,
    sequential: sequential_1.action_sequential,
    sleep: sleep_1.action_sleep,
    version: version_1.action_version,
    yarnInstallProd: yarnInstallProd_1.action_yarnInstallProd,
    zip: zip_1.action_zip,
};
// type ActionKeys = keyof typeof actions
//# sourceMappingURL=index.js.map