"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const lodash_1 = __importDefault(require("lodash"));
const util_1 = require("../../lib/util");
exports.actions = {
    "$expect": async function (action, parameters, 
    // {id, level, activity, runner, logger}: ActionMethodState
    state) {
        const { runner, logger, scopes } = state;
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
        const actual = await runner.eval(parameters[0], state);
        // console.log('>>>', actual)
        let res;
        let sValue;
        if (parameters.length === 1) {
            res = !!actual;
            sValue = JSON.stringify(actual);
        }
        else {
            const expected = await runner.eval(parameters[1], state);
            res = lodash_1.default.isEqual(actual, expected);
            sValue = JSON.stringify({ actual, expected });
        }
        const SCOPE_KEY_OK = '$expect_ok_count';
        const SCOPE_KEY_FAIL = '$expect_fail_count';
        const scope = scopes.global();
        if (typeof scope.get(SCOPE_KEY_OK) === 'undefined')
            scope.set(SCOPE_KEY_OK, 0);
        if (typeof scope.get(SCOPE_KEY_FAIL) === 'undefined')
            scope.set(SCOPE_KEY_FAIL, 0);
        if (res) {
            logger.success('$expect: OK:  ' + sValue);
            scope.set(SCOPE_KEY_OK, scope.get(SCOPE_KEY_OK, 0) + 1);
        }
        else {
            logger.error('$expect: FAIL: ' + sValue);
            scope.set(SCOPE_KEY_FAIL, scope.get(SCOPE_KEY_FAIL, 0) + 1);
        }
        return res;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=$expect.js.map