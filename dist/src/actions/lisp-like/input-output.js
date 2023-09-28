"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
const print_1 = require("./helpers/print");
const confirm_1 = require("./helpers/confirm");
/**
 * The Common Lisp Cookbook – Files and Directories
 * https://lispcookbook.github.io/cl-cookbook/files.html#writing-content-to-a-file
 *
 * How can I read the contents of a file into a list in Lisp?
 * https://stackoverflow.com/questions/3813895/how-can-i-read-the-contents-of-a-file-into-a-list-in-lisp
 *
 * Saving to file in Lisp
 * https://stackoverflow.com/questions/5440744/saving-to-file-in-lisp
 *
 * How to create and write into text file in Lisp
 * https://stackoverflow.com/questions/9495376/how-to-create-and-write-into-text-file-in-lisp
 */
exports.actions = {
    prin1: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const pValue = await evaluate(params[0]);
        const toPrint = (0, print_1.stringify)(pValue);
        (0, print_1.print)(toPrint);
        return pValue;
    },
    princ: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const pValue = await evaluate(params[0]);
        (0, print_1.print)(pValue, '\n');
        return pValue;
    },
    print: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const pValue = await evaluate(params[0]);
        const toPrint = (0, print_1.stringify)(pValue);
        (0, print_1.print)(toPrint, '\n');
        return pValue;
    },
    /**
     * yes-or-no-p
     *
     * https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node201.html
     * http://www.ai.mit.edu/projects/iiip/doc/CommonLISP/HyperSpec/Body/fun_y-or-n-pcm_yes-or-no-p.html
     */
    'y-or-n-p': async function (action, parameters, state) {
        const { runner, logger } = state;
        (0, util_1.fn_check_params)(parameters, { exactCount: [0, 1] });
        const value = parameters.length === 1
            ? String(await runner.eval(parameters[0], state))
            : 'Confirm y/[N]?';
        const res = await (0, confirm_1.confirm)(value);
        logger.info(`confirm: ${res}`);
        return res;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=input-output.js.map