"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const shelljs_1 = __importDefault(require("shelljs"));
const util_1 = require("../../lib/util");
const types_1 = require("../../lib/types");
const TRIM_RESULT = true;
/**
 * @module $shelljs
 */
exports.actions = {
    /**
     * @name $shelljs
     */
    $shelljs: async function (_, args, { evaluate, logger }) {
        //runner.debug('$shelljs', { parameters, prevResult });
        (0, util_1.fn_check_params)(args, { minCount: 1 });
        let shellParams = [];
        for (const p of args) {
            const pValue = await evaluate(p);
            const sValue = String(pValue);
            shellParams.push(sValue);
        }
        const shellCmd = shellParams.shift();
        if (!shellCmd)
            throw new Error(`shellCmd can't be empty`);
        // const fn = shelljs[shellCmd as keyof typeof shelljs];
        const fn = shelljs_1.default[shellCmd];
        (0, types_1.ensureFunction)(fn, `expect shelljs method`);
        // typecast fn to generic Function to avoid parameters typecheck
        let res = fn(...shellParams);
        // console.log('>>>>>', res)
        // console.log('>>>>>', JSON.stringify(res))
        // console.log('>>>>>', JSON.stringify((res as any).code))
        // const s = String(shellRes).trim();
        if (TRIM_RESULT) {
            res.stdout = res.stdout.trim();
            res.stderr = res.stderr.trim();
        }
        // logger.log(`[${action}] ` + res );
        logger.log([
            // `s: "${s}"`,
            `stdout: "${res.stdout}"`,
            `stderr: "${res.stderr}"`,
            `code: ${res.code}`,
        ].join(', '));
        // print(shellParams);
        return res.stdout;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=$shelljs.js.map