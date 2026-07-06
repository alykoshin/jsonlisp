/** @format */

/**
 * @module cl
 * The standard vocabulary — JL's analog of the COMMON-LISP package
 * ("home of symbols defined by the ANSI language specification").
 * Modules are named after CLHS chapters. ANSI symbols only; JL extensions
 * live in src/jl, third-party Lisp libraries in src/quicklisp, SBCL
 * packages in src/sbcl. See ARCHITECTURE.md.
 */

import {Actions} from '../eval/sexpr';

import conses from './conses'; // ch 14
import conditions from './conditions'; // ch 9
import dataAndControlFlow from './data-and-control-flow'; // ch 5
import environment from './environment'; // ch 25
import files from './files'; // ch 20
import numbers from './numbers'; // ch 12
import printer from './printer'; // ch 21/22
import sequences from './sequences'; // ch 17
import systemConstruction from './system-construction'; // ch 24

export const actions: Actions = {
  ...conses,
  ...conditions,
  ...dataAndControlFlow,
  ...environment,
  ...files,
  ...numbers,
  ...printer,
  ...sequences,
  ...systemConstruction,
};

export default actions;
