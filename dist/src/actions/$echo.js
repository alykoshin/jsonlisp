"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$echo = void 0;
const util_1 = require("../lib/util");
const print_1 = __importDefault(require("../helpers/print"));
async function $echo(action, parameters, state) {
    const { runner, logger } = state;
    (0, util_1.fn_check_params)(parameters, { minCount: 0 });
    let res = [];
    for (const p of parameters) {
        const value = await runner.eval(p, state);
        res.push(String(value));
    }
    // logger.info(res.join(', '));
    (0, print_1.default)(...res);
}
exports.$echo = $echo;
exports.default = $echo;
//# sourceMappingURL=$echo.js.map