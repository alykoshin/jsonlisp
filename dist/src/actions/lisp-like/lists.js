"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
function fn_nth(n, list) {
    // fn_check_params(params, {minCount: 2});
    // const [n, list] = params;
    (0, util_1.fn_check_params)(n, { typ: 'number' });
    (0, util_1.fn_check_params)(list, { minCount: n });
    return list[n];
}
function fn_rest(list) {
    (0, util_1.fn_check_params)(list, { minCount: 1 });
    return list.slice(1);
}
exports.actions = {
    list: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { minCount: 0 });
        const evaluated = [];
        for (const p of params) {
            const pValue = await evaluate(p);
            evaluated.push(pValue);
        }
        // if (!Array.isArray(evaluated)) throw new Error('Expecting array');
        return evaluated;
    },
    length: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const array = await evaluate(params[0]);
        if (!Array.isArray(array))
            throw new Error('Expecting array');
        return array.length;
    },
    nth: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 2 });
        const n = await evaluate(params[0]);
        const list = await evaluate(params[1]);
        return fn_nth(n, list);
    },
    first: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const list = await evaluate(params[0]);
        return fn_nth(0, list);
    },
    car: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const list = await evaluate(params[0]);
        return fn_nth(0, list);
    },
    //
    second: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const list = await evaluate(params[0]);
        return fn_nth(1, list);
    },
    third: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const list = await evaluate(params[0]);
        return fn_nth(2, list);
    },
    //
    cdr: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const list = await evaluate(params[0]);
        return fn_rest(list);
    },
    // rest: 'cdr'
    rest: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const list = await evaluate(params[0]);
        return fn_rest(list);
    },
    //
};
exports.default = exports.actions;
//# sourceMappingURL=lists.js.map