/** @format */

/**
 * @module cl
 * The standard vocabulary — JL's analog of the COMMON-LISP package
 * ("home of symbols defined by the ANSI language specification").
 * ANSI symbols only; JL extensions live in src/jl, non-ANSI Lisp
 * libraries in src/quicklisp, SBCL packages in src/sbcl.
 * See ARCHITECTURE.md.
 */

import {Actions} from '../eval/sexpr';

import conditionals from './conditionals';
import defines from './defines';
import error from './error';
import files from './files';
import inputOutput from './input-output';
import iterationAndMapping from './iteration-and-mapping';
import lists from './lists';
import operators from './operators';
import system from './system';

export const actions: Actions = {
  ...conditionals,
  ...defines,
  ...error,
  ...files,
  ...inputOutput,
  ...iterationAndMapping,
  ...lists,
  ...operators,
  ...system,
};

export default actions;
