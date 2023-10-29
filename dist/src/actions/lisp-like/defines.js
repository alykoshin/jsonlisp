"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const validateArgs_1 = require("../../apps/runner/lib/validateArgs");
const print_1 = require("./helpers/print");
/**
 * @module defines
 * @see
 * - LispWorks -- Common Lisp HyperSpec -- Macro DEFPARAMETER, DEFVAR --
 *   {@link http://clhs.lisp.se/Body/m_defpar.htm} <br>
 * - LispWorks -- Common Lisp HyperSpec -- Special Operator LET, LET* --
 *   {@link http://www.lispworks.com/documentation/lw60/CLHS/Body/s_let_l.htm} <br>
 */
exports.actions = {
    /**
     * @name parse-integer
     * @summary Convert string (decimal, binary etc) to number
     * @see
     * {@link https://stackoverflow.com/questions/57565902/convert-binary-string-to-number}<br>
     * AutoCAD dialect: {@link https://forums.autodesk.com/t5/visual-lisp-autolisp-and-general/convert-string-to-integer/td-p/817797} <br>
     */
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
    /**
     * @name setq
     * @see
     * Difference between `set`, `setq`, and `setf` in Common Lisp?
     * {@link https://stackoverflow.com/questions/869529/difference-between-set-setq-and-setf-in-common-lisp}
     */
    setq: async function (_, args, { evaluate, scopes, logger }) {
        (0, validateArgs_1.validateArgs)(args, { exactCount: 2 });
        const pName = await evaluate(args[0]);
        const sName = String(pName);
        const pValue = await evaluate(args[1]);
        // creates variable at local scope
        scopes.current().set(sName, pValue);
        logger.debug(`${sName} = ${(0, print_1.stringify)(pValue)}`);
        return pValue;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=defines.js.map