/** @format */
/**
 * @module eval/apply
 * [machinery] The application half of the eval/apply pair (SICP §4.1):
 * resolving a named action and invoking an executor function.
 *
 * `execFunction` is the single invocation site and carries the canonical
 * function/special-operator split: closures (isClosure, made by
 * kernel/lambda) are applicative — their args are evlis-ed here, exactly
 * once, in the caller's environment (McCarthy's eval does evlis; apply only
 * binds values — SICP §4.1, CLHS 3.1.2.1.2.3). Everything else is a special
 * form and receives raw args (ARCHITECTURE.md, divergence 1).
 */
import { Parameters, ExecutorFn, List, Expression } from './sexpr';
import { State } from './environment';
export declare const execNamedAction: (name: string, args: Parameters, st: State) => Promise<Expression>;
/** The single invocation (and error-wrapping) site for executors. */
export declare const execFunction: (fn: ExecutorFn, name: string, args: Parameters, st: State) => Promise<Expression>;
/** Lambda-form application: `[["lambda", ...], arg1, ...]`. */
export declare function evaluateListList(outer_arg0: List, outer_args: List, st: State): Promise<Expression>;
