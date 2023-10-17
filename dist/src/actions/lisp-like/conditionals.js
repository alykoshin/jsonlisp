"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../apps/runner/lib/util");
const types_1 = require("../../apps/runner/lib/types");
const primitives_1 = require("./core/primitives");
/**
 * @module conditionals
 */
exports.actions = {
    /** @name if */
    if: async function (_, args, { evaluate, logger }) {
        (0, util_1.fn_check_params)(args, { exactCount: [2, 3] });
        // const [pTest, pThen, pElse] = args;
        //
        //   const condition = asBoolean(await evaluate(pTest));
        //   logger.debug(`if: condition: ` + JSON.stringify(condition));
        //
        //   const branch = condition ? pThen : pElse;
        //   if (typeof branch !== 'undefined') {
        //     return await evaluate(branch);
        //   }
        //   return NIL;
        const if_args = ['quote', args];
        // prettier-ignore
        return evaluate([
            "cond",
            [["first", if_args], ["second", if_args]],
            [types_1.T, ["third", if_args]]
        ]);
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
    when: async function (_, args, { evaluate, logger }) {
        (0, util_1.fn_check_params)(args, { exactCount: 2 });
        const [testClause, actionWhenTrue] = args;
        const condition = await evaluate(testClause);
        logger.debug(`when: condition: ` + JSON.stringify(condition));
        if (condition) {
            return await evaluate(actionWhenTrue);
        }
        return null;
    },
    /** @name unless */
    unless: async function (_, args, { evaluate, logger }) {
        (0, util_1.fn_check_params)(args, { exactCount: 2 });
        const [testClause, actionWhenFalse] = args;
        const condition = await evaluate(testClause);
        logger.debug(`unless: condition: ` + JSON.stringify(condition));
        if (!condition) {
            return await evaluate(actionWhenFalse);
        }
        return null;
    },
    zerop: async function (_, args, { evaluate, logger }) {
        (0, util_1.fn_check_params)(args, { exactCount: 1 });
        const value = await evaluate(args[0]);
        (0, types_1.ensureNumber)(value);
        return evaluate(['=', value, 0]);
    },
};
exports.default = exports.actions;
//# sourceMappingURL=conditionals.js.map