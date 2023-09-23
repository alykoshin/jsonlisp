"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$build = void 0;
const util_1 = require("../../lib/util");
async function $build(action, parameters, state) {
    const { runner, logger } = state;
    (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
    const [pConfig] = parameters;
    const command = `webpack --mode production`;
    const execDefinition = [
        'exec',
        command,
        {
            ...pConfig,
        },
    ];
    return await runner.eval(execDefinition, state);
}
exports.$build = $build;
exports.default = $build;
//# sourceMappingURL=$build.js.map