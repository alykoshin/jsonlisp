"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
const types_1 = require("../../lib/types");
const primitives_1 = require("./core/primitives");
/**
 * @module conditionals
 */
exports.actions = {
    /** @name if */
    if: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: [2, 3] });
        const [pTest, pThen, pElse] = params;
        //   const condition = asBoolean(await evaluate(pTest));
        //   logger.debug(`if: condition: ` + JSON.stringify(condition));
        //   const branch = condition ? pThen : pElse;
        //   if (typeof branch !== 'undefined') {
        //     return await evaluate(branch);
        //   }
        //   return null;
        return evaluate(['cond', [pTest, pThen], [types_1.T, pElse]]);
    },
    // cond: async function (action, params, {evaluate, logger}) {
    //   fn_check_params(params, {minCount: 1});
    //   for (const i in params) {
    //     const [test, ...forms] = params[i] as Parameters;
    //     const condition = await evaluate(test);
    //     // logger.debug(`cond[{$i}]: condition:`, JSON.stringify(condition));
    //     logger.debug(`cond[${i}]: condition:`, condition);
    //     if (condition) {
    //       return seriesn(forms, evaluate);
    //     }
    //   }
    //   return null;
    // },
    cond: primitives_1.cond,
    /** @name when */
    when: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 2 });
        const [testClause, actionWhenTrue] = params;
        const condition = await evaluate(testClause);
        logger.debug(`when: condition: ` + JSON.stringify(condition));
        if (condition) {
            return await evaluate(actionWhenTrue);
        }
        return null;
    },
    /** @name unless */
    unless: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 2 });
        const [testClause, actionWhenFalse] = params;
        const condition = await evaluate(testClause);
        logger.debug(`unless: condition: ` + JSON.stringify(condition));
        if (!condition) {
            return await evaluate(actionWhenFalse);
        }
        return null;
    },
    zerop: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const value = await evaluate(params[0]);
        (0, types_1.ensureNumber)(value);
        return evaluate(['=', value, 0]);
    },
};
exports.default = exports.actions;
//# sourceMappingURL=conditionals.js.map