"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action_cleanup = void 0;
const fsUtils_1 = require("../lib/fsUtils");
async function action_cleanup(definition, { id, fullConfig, runner }) {
    for (const d of definition.dirs) {
        runner.debug(id, `cleanup ${d}`);
        await (0, fsUtils_1.removeDirRecursive)(d);
    }
}
exports.action_cleanup = action_cleanup;
//# sourceMappingURL=cleanup.js.map