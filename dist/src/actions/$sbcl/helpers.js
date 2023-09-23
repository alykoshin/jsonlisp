"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse_sbcl_bool = exports.get_sbcl_cmd = void 0;
function get_sbcl_cmd(lisp_expr) {
    lisp_expr = lisp_expr.replace(/"/g, '""');
    const cmd = 'sbcl';
    const opts = [
        `--noinform`,
        `--non-interactive`,
        `--noprint`,
        `--eval "( print ${lisp_expr} )"`,
    ];
    return [cmd, ...opts].join(' ');
    // return `sbcl --noinform --non-interactive --noprint --eval "( print ${lisp_expr} )"`;
}
exports.get_sbcl_cmd = get_sbcl_cmd;
function parse_sbcl_bool(lisp_bool, { logger } = {}) {
    if (lisp_bool === 'T')
        return true;
    else if (lisp_bool === 'NIL')
        return false;
    else {
        logger?.warn(`Expected LISP boolean, got "${lisp_bool}"`);
        return null;
    }
}
exports.parse_sbcl_bool = parse_sbcl_bool;
//# sourceMappingURL=helpers.js.map