"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.defun = exports.lambda = exports.createExecutorFn = void 0;
/**
 * @module kernel/lambda
 * Denoting functions (The Roots of Lisp §2): lambda, and label as `defun`.
 * `createExecutorFn` is the closure machinery; null_ / and_ are the first
 * two derived functions of the paper's sequence (jmc.lisp: null. and.),
 * written in JL itself.
 *
 * @see
 * - Common Lisp: Working with &rest parameters --
 *   https://stackoverflow.com/questions/629699/common-lisp-working-with-rest-parameters <br>
 * - LispWorks -- Common Lisp HyperSpec -- Function APPLY --
 *   {@link http://clhs.lisp.se/Body/f_apply.htm}
 */
const sexpr_1 = require("../eval/sexpr");
const evlis_1 = require("../eval/evlis");
const validate_args_1 = require("../eval/validate-args");
const passArgs_1 = require("./passArgs");
//
const createExecutorFn = function (name, argnames, body) {
    (0, sexpr_1.ensureList)(argnames);
    (0, sexpr_1.ensureList)(body);
    const fn = async function lambda(_, argvalues, st) {
        const { logger } = st;
        argvalues = await (0, evlis_1.series)(argvalues, st);
        const sc = (0, passArgs_1.passArgs)(argnames, argvalues);
        logger.debug('lambda:execute: scope:', sc, ',body:', body);
        st = st.newNextUp(name);
        st.scopes = st.scopes.copy().new(sc);
        // st.scopes.push(sc);
        logger.debug('lambda:execute: scopes:', st.scopes);
        const res = await st.evaluate(body);
        logger.debug('lambda:execute: res:', res);
        return res;
    };
    return fn;
};
exports.createExecutorFn = createExecutorFn;
/**
 * @name lambda
 * @see
 * - An Introduction to Programming in Emacs Lisp -- C.4.3 A lambda Expression: Useful Anonymity --
 *   {@link https://www.gnu.org/software/emacs/manual/html_node/eintr/lambda.html} <br>
 * - An Introduction to Programming in Emacs Lisp -- 13.2 Lambda Expressions --
 *   {@link https://www.gnu.org/software/emacs/manual/html_node/elisp/Lambda-Expressions.html} <br>
 * - Common Lisp the Language, 2nd Edition -- 5.2.2. Lambda-Expressions --
 *   {@link https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node64.html} <br>
 */
const lambda = async function (_, args, { evaluate }) {
    const [argnames, body] = (0, validate_args_1.validateArgs)(args, { exactCount: 2 });
    return (0, exports.createExecutorFn)('lambda', argnames, body);
};
exports.lambda = lambda;
/**
 * @name defun
 * The paper's `label`, in its modern form: registers into the function
 * namespace (Lisp-2 divergence — see ARCHITECTURE.md).
 */
const defun = async function (_, args, state) {
    const [name, argnames, body] = (0, validate_args_1.validateArgs)(args, { exactCount: 3 });
    (0, sexpr_1.ensureString)(name, `Expect string as a name of function`);
    state.actions[name] = (0, exports.createExecutorFn)(name, argnames, body);
    return name;
};
exports.defun = defun;
// null_ and and_ moved to kernel/derived (the paper's derived-function
// sequence lives there in full).
exports.actions = {
    lambda: exports.lambda,
    defun: exports.defun,
};
exports.default = exports.actions;
//# sourceMappingURL=lambda.js.map