"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const actions = {
    '$sbcl': async function (a, b, { parameters, evaluate }) {
        const line = await evaluate(parameters[0]);
        // const res = await evaluate([ `$exec`, `sbcl --noinform --non-interactive --noprint --eval \"( print ${line} )\"` ]);
        const res = await evaluate([`$exec`, (0, helpers_1.get_sbcl_cmd)(String(line))]);
        return res[0];
    },
    '$sbcl-to-int': async function (a, b, { parameters, evaluate }) {
        return await evaluate(['parse-integer',
            [`$sbcl`, parameters[0]]]);
    },
    '$parse-sbcl-bool': async function (a, b, { parameters, evaluate, logger }) {
        const res = String(await evaluate(parameters[0]));
        // if (res === 'T') return true;
        // else if (res === 'NIL') return false;
        // else return null;
        return (0, helpers_1.parse_sbcl_bool)(res, { logger });
    },
    '$sbcl-to-bool': async function (a, b, { parameters, evaluate }) {
        return await evaluate(['$parse-sbcl-bool',
            [`$sbcl`, parameters[0]]]);
    },
};
exports.default = actions;
//# sourceMappingURL=index.js.map