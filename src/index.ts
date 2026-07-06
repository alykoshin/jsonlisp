/** @format */

/**
 * jsonlisp / JL — public facade.
 *
 * Layers (see ARCHITECTURE.md):
 *   eval/      the evaluator (makeEvaluator, Environment, S-expression model)
 *   kernel/    the axiomatic kernel (7 primitives, lambda/defun, derived fns)
 *   cl/        ANSI COMMON-LISP vocabulary
 *   sbcl/      SBCL packages we emulate
 *   quicklisp/ third-party CL systems
 *   jl/        JL dialect extensions
 *   host/      non-Lisp host tooling ($-marked)
 */

export * from './eval';
export * from './kernel/booleans';

export {default as kernel} from './kernel';
export {default as cl} from './cl';
// async: the image is built (the jmc vocabulary is cold-loaded from JL
// source through the real evaluator), not a module-load-time constant
export {defaultActions} from './modules';

export {Runner} from './toplevel/runner';
export {Activities} from './toplevel/Activities';
export type {Activity} from './toplevel/Activities';
