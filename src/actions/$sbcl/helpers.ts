import { cat } from 'shelljs';
import json5 from 'json5';

import { LogPrefix, Logger } from '../../lib/log';
import { Parameter } from '../../lib/runner';

export function get_sbcl_cmd(lisp_expr: string): string {
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

export function parse_sbcl_bool(
  lisp_bool: string,
  { logger }: { logger?: Logger<LogPrefix> } = {}
) {
  if (lisp_bool === 'T') return true;
  else if (lisp_bool === 'NIL') return false;
  else {
    logger?.warn(`Expected LISP boolean, got "${lisp_bool}"`);
    return null;
  }
}

const LBRACKET = '(';
const RBRACKET = ')';
/**
 * !!! Strings are not supported !!!
 */
export function parse_sbcl_list(
  str: string,
  { logger }: { logger: Logger<LogPrefix> }
): Parameter {
  type Atom = null | number | string | boolean;
  // function newToken(token: string) {
  // if (token.length > 0) {
  // res.push(token);
  // }
  // }
  function parseAtom(token: string): Atom {
    let r: Atom = null;
    if (token.length > 0) {
      if (token === LBRACKET) {
        r = '[';
        // if (firstBracket) {
        // firstBracket = false;
        // }else {
        // r = ', '+r;
        // }
      } else if (token === RBRACKET) {
        r = ']';
      } else if (token === 'T') {
        r = true;
      } else if (token === 'NIL') {
        r = false;
      } else if (token.match(/^[0123456789\.\/]+$/)) {
        // integer or float number or fraction (example: 1/2)
        const [sNominator, sDenominator] = token.split('/');
        const nNominator = parseFloat(sNominator);
        if (sDenominator) {
          const nDenominator = parseFloat(sDenominator);
          // convert it to decimal for simplicity
          r = nNominator / nDenominator;
        } else {
          r = nNominator;
        }
        // r = token;
        // } else if (token.match(/^[0123456789\.]+$/)) {
        //   // integer or float number
        //   r = parseFloat(token);
        //   // r = token;
      } else if (token[0] === '"' && token[token.length - 1] === '"') {
        // String in double quotes
        // Leave double quotes as it is
        r = `${token}`;
      } else {
        // Anything else
        // Consider it as string
        r = `"${token}"`;
      }
    }
    return r;
  }

  function newAtom(token: string) {
    let r: Atom;
    if (token.length > 0) {
      r = parseAtom(token);
      const last = res[res.length - 1];
      if (
        last &&
        last !== '[' //||
      ) {
        res.push(',');
      }
      res.push(r);
    }
  }

  // const result: Parameter = [];
  // let firstBracket = true;
  const res: Atom[] = [];
  let curr = '';
  for (const c of str) {
    if (c === LBRACKET || c === RBRACKET) {
      newAtom(curr);
      newAtom(c);
      curr = '';
    } else if (c === ' ' || c === '\n' || c === '\r') {
      newAtom(curr);
      curr = '';
    } else {
      curr += c;
    }
  }
  if (curr.length > 0) newAtom(curr);

  let result;
  try {
    const sRes = res.join(' ');
    logger.debug('>>>', sRes);

    result = json5.parse(sRes);
    // result = JSON.parse(sRes);
    logger.debug('>>>', result);
  } catch (e) {
    logger.error('>>> Unable to parse output from sbcl', (e as Error).message);
  }
  return result;
}
//
//
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
// parse_sbcl_list('true');
// parse_sbcl_list('false');
//
//
