/** @format */

/**
 * @module kernel
 * The axiomatic kernel (Graham, "The Roots of Lisp"): the seven primitives,
 * lambda/defun, and the paper's derived functions. See ARCHITECTURE.md.
 */

import {Actions} from '../eval/sexpr';

import primitives from './primitives';
import lambda from './lambda';
import derived from './derived';

export * from './booleans';

export const actions: Actions = {
  ...primitives,
  ...lambda,
  ...derived,
};

export default actions;
