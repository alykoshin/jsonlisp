/** @format */

/**
 * @module host/sbcl-bridge/reader
 * A minimal reader for SBCL's PRINTED output: parses what `(print …)`
 * emits (lists, numbers incl. ratios, T/NIL, symbols) back into JL data.
 *
 * Vendored from lisp2jl@0.0.2 (dist/apps/translator-primitive) to break the
 * lisp2jl ⇄ jsonlisp circular dependency — lisp2jl depends on this package
 * (via its pre-rename name tools-runner); we needed only these two
 * functions back.
 *
 * !!! Strings with embedded spaces/brackets are not supported !!!
 */

import JSON5 from 'json5';
import {Parameter} from '../../eval/sexpr';
import type {ILogger} from '../../lib/log';

export function parse_sbcl_bool(
  lisp_bool: string,
  {logger}: {logger?: ILogger} = {}
): boolean | null {
  if (lisp_bool === 'T') return true;
  else if (lisp_bool === 'NIL') return false;
  else {
    logger?.warn(`Expected LISP boolean, got "${lisp_bool}"`);
    return null;
  }
}

const LBRACKET = '(';
const RBRACKET = ')';

export function parse_sbcl_list(
  str: string,
  {logger}: {logger: ILogger}
): Parameter {
  function parseAtom(token: string): string | number | boolean | null {
    let r: string | number | boolean | null = null;
    if (token.length > 0) {
      if (token === LBRACKET) {
        r = '[';
      } else if (token === RBRACKET) {
        r = ']';
      } else if (token === 'T') {
        r = true;
      } else if (token === 'NIL') {
        r = false;
      } else if (token.match(/^[0123456789\.\/\-]+$/)) {
        // integer or float number or ratio (example: 1/2)
        const [sNominator, sDenominator] = token.split('/');
        const nNominator = parseFloat(sNominator);
        if (sDenominator) {
          const nDenominator = parseFloat(sDenominator);
          // convert it to decimal for simplicity
          r = nNominator / nDenominator;
        } else {
          r = nNominator;
        }
      } else if (token[0] === '"' && token[token.length - 1] === '"') {
        // String in double quotes — leave double quotes as is: they are what
        // distinguishes a CL string from a symbol once both become JL strings.
        // The atoms are re-joined into a JSON5 source (res.join below), so
        // the token must be escaped as a string literal — emitting it bare
        // made JSON5.parse consume the quotes as syntax (upstream lisp2jl
        // bug: strings collapsed into symbols, contradicting this comment).
        r = JSON.stringify(token);
      } else {
        // Anything else (symbols) — consider it a string
        r = `"${token}"`;
      }
    }
    return r;
  }

  const res: (string | number | boolean | null)[] = [];

  function newAtom(token: string): void {
    if (token.length > 0) {
      const r = parseAtom(token);
      const last = res[res.length - 1];
      if (last && last !== '[') {
        res.push(',');
      }
      res.push(r);
    }
  }

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

  let result: Parameter;
  try {
    const sRes = res.join(' ');
    result = JSON5.parse(sRes);
  } catch (e) {
    if (str.match(/#<FUNCTION \(LAMBDA \(\)\) {.*}>/gi)) {
      const lambdaRes = ['lambda', [], []];
      logger.warn(
        `sbcl returned "${str}"; ` +
          `returning "${JSON.stringify(lambdaRes)}" instead`
      );
      return lambdaRes;
    }
    logger.warn('>>> Unable to parse output from sbcl', (e as Error).message);
  }
  return result;
}
