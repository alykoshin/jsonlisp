"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const lodash_1 = __importDefault(require("lodash"));
const util_1 = require("../lib/util");
exports.actions = {
    "$expect": async function (action, parameters, { id, level, fullConfig, runner, logger }) {
        //runner.debug('$expect', { parameters, prevResult });
        (0, util_1.fn_check_params)(parameters, { exactCount: [1, 2] });
        // let actual;
        // if (parameters.length === 1) {
        //   // throw '$expect: parameters.length === 1 not supported'
        //   // actual = prevResult;
        //   //else if (parameters.length === 2) actual = this._getNextParam(parameters);
        //   actual = await runner.eval(parameters[0], fullConfig, {level, logger});
        //
        // } else if (parameters.length === 2) {
        //   actual = await runner.eval(parameters[0], fullConfig, {level, logger});
        // }
        const actual = await runner.eval(parameters[0], fullConfig, { level, logger });
        // console.log('>>>>>>>>', actual)
        let res;
        let sValue;
        if (parameters.length === 1) {
            res = !!actual;
            sValue = JSON.stringify(actual);
        }
        else {
            const expected = await runner.eval(parameters[1], fullConfig, { level, logger });
            res = lodash_1.default.isEqual(actual, expected);
            sValue = JSON.stringify({ actual, expected });
        }
        if (res)
            logger.success('$expect: OK:   ' + sValue);
        else
            logger.error('$expect: FAIL: ' + sValue);
        return res;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=$expect.js.map