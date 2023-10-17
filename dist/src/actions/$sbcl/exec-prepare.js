"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_sbcl_cmd = exports.preprocess_sbcl_expr = void 0;
function preprocess_sbcl_expr(lisp_expr) {
    // escape double quotes
    lisp_expr = lisp_expr.replace(/"/g, '""');
    // replace EOLs (and spaces) with single space
    lisp_expr = lisp_expr.replace(/[ \r\n]+/g, ' ');
    lisp_expr = lisp_expr.trim();
    return lisp_expr;
}
exports.preprocess_sbcl_expr = preprocess_sbcl_expr;
function _get_sbcl_cmd(safe_lisp_expr) {
    const cmd = 'sbcl';
    const opts = [
        `--noinform`,
        `--non-interactive`,
        `--noprint`,
        `--eval "( print ${safe_lisp_expr} )"`,
    ];
    return [cmd, ...opts].join(' ');
    // return `sbcl --noinform --non-interactive --noprint --eval "( print ${lisp_expr} )"`;
}
function get_sbcl_cmd(lisp_expr) {
    return _get_sbcl_cmd(preprocess_sbcl_expr(lisp_expr));
}
exports.get_sbcl_cmd = get_sbcl_cmd;
//# sourceMappingURL=exec-prepare.js.map