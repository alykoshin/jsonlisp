/** @format */

import {validateArgs} from '../eval/validate-args';
import {Actions, ExecutorFn, isList, isEmptyList} from '../eval/sexpr';
import {operators} from '../cl/numbers';

/**
 * @module jl
 * JL's own dialect extensions — vocabulary WE invented, appearing in no
 * external canon: '?' (describe), ';' (comment), `nullp` (ANSI name is
 * `null`), `%` (JS-flavored truncate-rem). The analog of SB-EXT: what this
 * implementation adds — and like SB-EXT uses COMMON-LISP, jl may import cl.
 *
 * @description
 * Seems there is no single command to print all the variables in the Lisp
 * (including current scope etc)
 * Couple of articles how it may be done.
 *
 * @see
 * How can I list all of the defined functions and global variables that are active in common lisp <br>
 * - {@link https://stackoverflow.com/questions/42016114/how-can-i-list-all-of-the-defined-functions-and-global-variables-that-are-active} <br>
 * - {@link http://www.lispworks.com/documentation/HyperSpec/Body/m_do_sym.htm} <br>
 * Macro DO-SYMBOLS, DO-EXTERNAL-SYMBOLS, DO-ALL-SYMBOLS <br>
 */

export const actions: Actions = {
  /** @name ?
   */
  '?': async function (_, args, {actions, logger}) {
    const actionNames = Object.keys(actions).sort();
    logger.info('Available commands:', actionNames.join(', '));
    return undefined;
  },

  /** @name ; */
  ';': async function (_, args, {logger}) {
    logger.debug(`Found ";", skipping the list`);
    return undefined;
  },

  /** @name nullp — JL-ism; the ANSI predicate is `null` */
  nullp: (async (_, args, st) => {
    validateArgs(args, {exactCount: 1});
    const a0 = await st.evaluate(args[0]);
    return isList(a0) && isEmptyList(a0);
  }) as ExecutorFn,

  /** @name % — JL-ism: JS-flavored remainder (= CL rem, truncate semantics) */
  '%': operators,
};

export default actions;
