"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const shelljs_1 = __importDefault(require("shelljs"));
const util_1 = require("../../lib/util");
exports.actions = {
    $shelljs: async function (action, parameters, state) {
        const { runner, logger } = state;
        //runner.debug('$shelljs', { parameters, prevResult });
        (0, util_1.fn_check_params)(parameters, { minCount: 1 });
        let shellParams = [];
        for (const p of parameters) {
            const pValue = await runner.eval(p, state);
            const sValue = String(pValue);
            shellParams.push(sValue);
        }
        const shellCmd = shellParams.shift();
        if (!shellCmd)
            throw new Error(`shellCmd cannot be empty`);
        const fn = shelljs_1.default[shellCmd];
        if (typeof fn !== 'function')
            throw new Error(`first parameter of $shelljs must match the name of shelljs method`);
        let shellRes = fn(...shellParams);
        // console.log('>>>>>', res)
        // console.log('>>>>>', JSON.stringify(res))
        // console.log('>>>>>', JSON.stringify((res as any).code))
        const s = String(shellRes).trim();
        // logger.log(`[${action}] ` + res );
        logger.log(`s: "${s}", stdout: "${shellRes.stdout}", stderr: "${shellRes.stderr}", code: ${shellRes.code}`);
        // print(shellParams);
        return s;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=$shelljs.js.map