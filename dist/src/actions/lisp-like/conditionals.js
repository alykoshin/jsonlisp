"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
const series_1 = require("./helpers/series");
exports.actions = {
    if: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: [2, 3] });
        const [pTest, pThen, pElse] = params;
        const condition = !!(await evaluate(pTest));
        logger.debug(`if: condition: ` + JSON.stringify(condition));
        if (condition) {
            return await evaluate(pThen);
        }
        else {
            if (typeof pElse !== 'undefined') {
                return await evaluate(pElse);
            }
        }
        return null;
    },
    cond: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { minCount: 1 });
        for (const i in params) {
            const [test, ...forms] = params[i];
            const condition = await evaluate(test);
            // logger.debug(`cond[{$i}]: condition:`, JSON.stringify(condition));
            logger.debug(`cond[${i}]: condition:`, condition);
            if (condition) {
                return (0, series_1.seriesLast)(forms, evaluate);
            }
        }
        return null;
    },
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
};
exports.default = exports.actions;
//# sourceMappingURL=conditionals.js.map