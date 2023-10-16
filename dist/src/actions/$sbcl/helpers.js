"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse_sbcl_list = exports.parse_sbcl_bool = exports.get_sbcl_cmd = void 0;
const json5_1 = __importDefault(require("json5"));
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
const LBRACKET = '(';
const RBRACKET = ')';
/*
 * !!! Strings are not supported !!!
 */
function parse_sbcl_list(str, { logger }) {
    // function newToken(token: string) {
    // if (token.length > 0) {
    // res.push(token);
    // }
    // }
    function parseAtom(token) {
        let r = null;
        if (token.length > 0) {
            if (token === LBRACKET) {
                r = '[';
                // if (firstBracket) {
                // firstBracket = false;
                // }else {
                // r = ', '+r;
                // }
            }
            else if (token === RBRACKET) {
                r = ']';
            }
            else if (token === 'T') {
                r = true;
            }
            else if (token === 'NIL') {
                r = false;
            }
            else if (token.match(/^[0123456789\.\/\-]+$/)) {
                // integer or float number or fraction (example: 1/2)
                const [sNominator, sDenominator] = token.split('/');
                const nNominator = parseFloat(sNominator);
                if (sDenominator) {
                    const nDenominator = parseFloat(sDenominator);
                    // convert it to decimal for simplicity
                    r = nNominator / nDenominator;
                }
                else {
                    r = nNominator;
                }
                // r = token;
                // } else if (token.match(/^[0123456789\.]+$/)) {
                //   // integer or float number
                //   r = parseFloat(token);
                //   // r = token;
            }
            else if (token[0] === '"' && token[token.length - 1] === '"') {
                // String in double quotes
                // Leave double quotes as it is
                r = `${token}`;
            }
            else {
                // Anything else
                // Consider it as string
                r = `"${token}"`;
            }
        }
        return r;
    }
    function newAtom(token) {
        let r;
        if (token.length > 0) {
            r = parseAtom(token);
            const last = res[res.length - 1];
            if (last &&
                last !== '[' //||
            ) {
                res.push(',');
            }
            res.push(r);
        }
    }
    // const result: Parameter = [];
    // let firstBracket = true;
    const res = [];
    let curr = '';
    for (const c of str) {
        if (c === LBRACKET || c === RBRACKET) {
            newAtom(curr);
            newAtom(c);
            curr = '';
        }
        else if (c === ' ' || c === '\n' || c === '\r') {
            newAtom(curr);
            curr = '';
        }
        else {
            curr += c;
        }
    }
    if (curr.length > 0)
        newAtom(curr);
    let result;
    try {
        const sRes = res.join(' ');
        logger.debug('>>>', sRes);
        result = json5_1.default.parse(sRes);
        // result = JSON.parse(sRes);
        logger.debug('>>>', result);
    }
    catch (e) {
        logger.error('>>> Unable to parse output from sbcl', e.message);
    }
    return result;
}
exports.parse_sbcl_list = parse_sbcl_list;
//
//
// const logger = new Logger({ id: 'test', level: 0,})
// parse_sbcl_list(`
//   (print
//     (cond
//       (T 10 11 )
//       (T 20 )
//     )
//   )`
// );
// parse_sbcl_list('10');
// parse_sbcl_list('(10)');
// parse_sbcl_list('NIL', {logger});
// parse_sbcl_list('T', {logger});
//
//
//# sourceMappingURL=helpers.js.map