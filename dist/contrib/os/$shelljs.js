"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const shelljs_1 = __importDefault(require("shelljs"));
const validate_args_1 = require("../../eval/validate-args");
const sexpr_1 = require("../../eval/sexpr");
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
        (0, validate_args_1.validateArgs)(args, { minCount: 1 });
        let shellParams = [];
        for (const p of args) {
            const pValue = await evaluate(p);
            const sValue = String(pValue);
            shellParams.push(sValue);
        }
        const shellCmd = shellParams.shift();
        if (!shellCmd)
            throw new Error(`shellCmd can't be empty`);
        const fn = shelljs_1.default[shellCmd];
        (0, sexpr_1.ensureFunction)(fn, `expect shelljs method`);
        logger.log(shellCmd, shellParams);
        // typecast fn to generic Function to avoid parameters typecheck
        let res = fn(...shellParams);
        if (TRIM_RESULT) {
            res.stdout = res.stdout?.trim() || '';
            res.stderr = res.stderr?.trim() || '';
        }
        if (res.stdout)
            logger.log(res.stdout);
        if (res.stderr)
            logger.warn(res.stderr);
        if (res.code !== 0)
            logger.warn(`Exit code: ${res.code}`);
        return res.stdout;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=$shelljs.js.map