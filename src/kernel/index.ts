/** @format */

/**
 * @module kernel
 * The axiomatic kernel (Graham, "The Roots of Lisp"): the seven primitives,
 * lambda/defun, and the paper's derived functions. See ARCHITECTURE.md.
 */

import {Actions} from '../eval/sexpr';

import primitives from './primitives';
import lambda from './lambda';

export * from './booleans';

export const actions: Actions = {
  ...primitives,
  ...lambda,
};

export default actions;
