/** @format */

import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {Actions, NIL, Parameters, T} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';
import {print, stringify, EOL, atBOL} from './helpers/print';
import {confirm as confirm_} from './helpers/confirm';

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
export const actions: Actions = {
  /**
   * @name terpri
   * @see {@link http://clhs.lisp.se/Body/f_terpri.htm#terpri}
   */
  terpri: async function (action, params, {evaluate, logger}) {
    validateArgs(params, {exactCount: 0});
    print(EOL);
    return NIL;
  },

  /**
   * @name fresh-line
   * @see {@link http://clhs.lisp.se/Body/f_terpri.htm#fresh-line}
   */
  'fresh-line': async function (action, params, {evaluate, logger}) {
    validateArgs(params, {exactCount: 0});
    if (atBOL) {
      print(EOL);
      return T;
    }
    return NIL;
  },

  /** @name prin1 */
  prin1: async function (action, params, {evaluate, logger}) {
    validateArgs(params, {exactCount: 1});

    const pValue = await evaluate(params[0]);
    const toPrint = stringify(pValue);

    print(toPrint);
    return pValue;
  },

  /** @name princ */
  princ: async function (action, params, {evaluate, logger}) {
    validateArgs(params, {exactCount: 1});

    const pValue = await evaluate(params[0]);

    print(pValue, '\n');
    return pValue;
  },

  /** @name print */
  print: async function (action, params, {evaluate, logger}) {
    validateArgs(params, {exactCount: 1});

    const pValue = await evaluate(params[0]);
    const toPrint = stringify(pValue);

    print(toPrint, '\n');
    return pValue;
  },

  /**
   * @name format
   *
   * @see
   * {@link http://www.ulisp.com/show?3L#format}
   */
  format: async function (_, args, {evaluate, logger}) {
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
  'y-or-n-p': async function (_, args, {evaluate, logger}) {
    validateArgs(args, {exactCount: [0, 1]});
    const value =
      args.length === 1 ? String(await evaluate(args[0])) : 'Confirm y/[N]?';
    const res = await confirm_(value);

    logger.info(`confirm: ${res}`);
    return res;
  },
};

export default actions;
