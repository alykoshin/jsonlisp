"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
function fn_nth(parameters) {
    (0, util_1.fn_check_params)(parameters, { minCount: 2 });
    const n = parameters[0];
    const list = parameters[1];
    console.log('>>>', list);
    // fn_check_params(list, {minCount: n});
    // return list[n];
}
;
exports.actions = {
    'parse-integer': async function (a, b, { parameters, evaluate }) {
        return parseInt(String(await evaluate(parameters[0])));
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
    "list": async function (action, parameters, state) {
        const { activity, scopes, runner, logger } = state;
        (0, util_1.fn_check_params)(parameters, { minCount: 0 });
        const evaluated = [];
        for (const p of parameters) {
            const pValue = await runner.eval(p, state);
            evaluated.push(pValue);
        }
        // if (!Array.isArray(evaluated)) throw new Error('Expecting array');
        return evaluated;
    },
    "length": async function (action, parameters, state) {
        const { activity, scopes, runner, logger } = state;
        (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
        const array = await runner.eval(parameters[0], state);
        if (!Array.isArray(array))
            throw new Error('Expecting array');
        return array.length;
    },
    "nth": async function (action, parameters, { id, level, activity, scopes, runner, logger }) {
        (0, util_1.fn_check_params)(parameters, { exactCount: 2 });
        return fn_nth.call(this, parameters);
    },
    "first": async function (action, parameters, { id, level, activity, scopes, runner, logger }) {
        (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
        parameters.unshift(0);
        return fn_nth.call(this, parameters);
    },
    "second": async function (action, parameters, { id, level, activity, scopes, runner, logger }) {
        (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
        parameters.unshift(1);
        return fn_nth.call(this, parameters);
    },
    "third": async function (action, parameters, { id, level, activity, scopes, runner, logger }) {
        (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
        parameters.unshift(2);
        return fn_nth.call(this, parameters);
    },
    // ...
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
    "if": async function (action, parameters, { id, level, activity, scopes, runner, logger }) {
        throw new Error('Not implemented');
        /*
            fn_check_params(parameters, {exactCount: 2});
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