"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
function fn_nth(parameters) {
    (0, util_1.fn_check_params)(parameters, { minCount: 2 });
    const [n, list] = parameters;
    (0, util_1.fn_check_params)(n, { typ: 'number' });
    (0, util_1.fn_check_params)(list, { minCount: n });
    return list[n];
}
;
exports.actions = {
    'parse-integer': async function (a, params, { evaluate }) {
        return parseInt(String(await evaluate(params[0])));
    },
    /* let: async function let_(
       action: string,
       parameters: Parameters,
       {id, level, fullConfig, scopes, runner, logger}: ActionMethodState
     ) {
       fn_check_params(parameters, {exactCount: 2})
   
       const pName = await runner.eval(parameters[0], fullConfig, {level, logger});
       const sName = String(pName)
   
       const pValue = await runner.eval(parameters[1], fullConfig, {level, logger});
       const sValue = String(pValue)
   
       // let creates variable at local scope
   
       scopes.current().set(sName, sValue);
       return sValue;
     },
   */
    "setq": async function (action, parameters, state) {
        const { activity, scopes, runner, logger } = state;
        (0, util_1.fn_check_params)(parameters, { exactCount: 2 });
        const pName = await runner.eval(parameters[0], state);
        const sName = String(pName);
        const pValue = await runner.eval(parameters[1], state);
        const sValue = String(pValue);
        // let creates variable at local scope
        scopes.current().set(sName, sValue);
        return sValue;
    },
    "format": async function (action, parameters, { id, level, activity, scopes, runner, logger }) {
        throw new Error('Not implemented');
        /*   fn_check_params(parameters, {exactCount: 2});
           const destination = this._getNextParam(parameters) || '';
           if (destination.toUpperCase() !== 'T') throw new Error('Invalid destination in format');
           const controlString = this._getNextParam(parameters) || '';
           console.log('format', controlString);
           return result;
        */ 
    },
};
exports.default = exports.actions;
//# sourceMappingURL=defining-variables-and-functions.js.map