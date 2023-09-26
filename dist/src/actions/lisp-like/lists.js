"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
function fn_nth(n, list) {
    // fn_check_params(parameters, {minCount: 2});
    // const [n, list] = parameters;
    (0, util_1.fn_check_params)(n, { typ: 'number' });
    (0, util_1.fn_check_params)(list, { minCount: n });
    return list[n];
}
function fn_rest(list) {
    (0, util_1.fn_check_params)(list, { minCount: 1 });
    return list.slice(1);
}
exports.actions = {
    list: async function (action, parameters, state) {
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
    length: async function (action, parameters, state) {
        const { activity, scopes, runner, logger } = state;
        (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
        const array = await runner.eval(parameters[0], state);
        if (!Array.isArray(array))
            throw new Error('Expecting array');
        return array.length;
    },
    nth: async function (action, parameters, state) {
        const { runner } = state;
        (0, util_1.fn_check_params)(parameters, { exactCount: 2 });
        const n = await runner.eval(parameters[0], state);
        const list = await runner.eval(parameters[1], state);
        return fn_nth(n, list);
    },
    first: async function (action, parameters, state) {
        const { runner } = state;
        (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
        const list = await runner.eval(parameters[0], state);
        return fn_nth(0, list);
    },
    car: async function (action, parameters, state) {
        const { runner } = state;
        (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
        const list = await runner.eval(parameters[0], state);
        return fn_nth(0, list);
    },
    //
    second: async function (action, parameters, state) {
        const { runner } = state;
        (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
        const list = await runner.eval(parameters[0], state);
        return fn_nth(1, list);
    },
    third: async function (action, parameters, state) {
        const { runner } = state;
        (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
        const list = await runner.eval(parameters[0], state);
        return fn_nth(2, list);
    },
    //
    cdr: async function (action, parameters, state) {
        const { runner } = state;
        (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
        const list = await runner.eval(parameters[0], state);
        const res = fn_rest(list);
        return res;
    },
    // rest: 'cdr'
    rest: async function (action, parameters, state) {
        const { runner } = state;
        (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
        const list = await runner.eval(parameters[0], state);
        const res = fn_rest(list);
        return res;
    },
    //
};
exports.default = exports.actions;
//# sourceMappingURL=lists.js.map