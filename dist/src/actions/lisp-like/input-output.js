"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
const types_1 = require("../../lib/types");
const print_1 = require("./helpers/print");
const confirm_1 = require("./helpers/confirm");
/**
 * @module input-output
 *
 * @see
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
    /**
     * @name terpri
     * @see {@link http://clhs.lisp.se/Body/f_terpri.htm#terpri}
     */
    terpri: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 0 });
        (0, print_1.print)(print_1.EOL);
        return types_1.NIL;
    },
    /**
     * @name fresh-line
     * @see {@link http://clhs.lisp.se/Body/f_terpri.htm#fresh-line}
     */
    'fresh-line': async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 0 });
        if (print_1.atBOL) {
            (0, print_1.print)(print_1.EOL);
            return types_1.T;
        }
        return types_1.NIL;
    },
    /** @name prin1 */
    prin1: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const pValue = await evaluate(params[0]);
        const toPrint = (0, print_1.stringify)(pValue);
        (0, print_1.print)(toPrint);
        return pValue;
    },
    /** @name princ */
    princ: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const pValue = await evaluate(params[0]);
        (0, print_1.print)(pValue, '\n');
        return pValue;
    },
    /** @name print */
    print: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const pValue = await evaluate(params[0]);
        const toPrint = (0, print_1.stringify)(pValue);
        (0, print_1.print)(toPrint, '\n');
        return pValue;
    },
    /**
     * @name format
     *
     * @see
     * {@link http://www.ulisp.com/show?3L#format}
     */
    format: async function (action, parameters, { evaluate, logger }) {
        throw new Error('Not implemented');
        /*   fn_check_params(parameters, {exactCount: 2});
        const destination = this._getNextParam(parameters) || '';
        if (destination.toUpperCase() !== 'T') throw new Error('Invalid destination in format');
        const controlString = this._getNextParam(parameters) || '';
        console.log('format', controlString);
        return result;
     */
    },
    /**
     * @name yes-or-no-p
     *
     * @see
     * {@link https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node201.html}
     * {@link http://www.ai.mit.edu/projects/iiip/doc/CommonLISP/HyperSpec/Body/fun_y-or-n-pcm_yes-or-no-p.html}
     */
    'y-or-n-p': async function (_, args, { evaluate, logger }) {
        (0, util_1.fn_check_params)(args, { exactCount: [0, 1] });
        const value = args.length === 1 ? String(await evaluate(args[0])) : 'Confirm y/[N]?';
        const res = await (0, confirm_1.confirm)(value);
        logger.info(`confirm: ${res}`);
        return res;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=input-output.js.map