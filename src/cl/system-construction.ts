/** @format */

import {validateArgs} from '../eval/validate-args';
import {Actions, ensureString} from '../eval/sexpr';
import {T} from '../kernel/booleans';
import {readJlProgramSync} from '../kernel/load';

/**
 * @module cl/system-construction
 * CLHS chapter 24 "System Construction": `load`. (`require` exists as the
 * declarative `requires:` activity key — see src/modules/index.ts;
 * provide/compile-file are not implemented.)
 */

export const actions: Actions = {
  /**
   * @name load
   * (load filespec) — read a JL program file (a top-level array of forms;
   * one reader shared with the cold loader, kernel/load) and evaluate each
   * form in order in the CURRENT environment: defun registers, setq sets
   * scope, exactly as if typed inline. Returns T on success, per CL.
   */
  load: async function (_, args, {evaluate, logger}) {
    validateArgs(args, {exactCount: 1});
    const pathname = await evaluate(args[0]);
    ensureString(pathname, `load: expected a file path`);
    const program = readJlProgramSync(pathname);
    logger.debug(`load: "${pathname}", ${program.length} top-level form(s)`);
    for (const form of program) {
      await evaluate(form);
    }
    return T;
  },
};

export default actions;
