/** @format */
/**
 * @module eval/apply
 * [machinery] The application half of the eval/apply pair (SICP §4.1):
 * resolving a named action and invoking an executor function.
 *
 * `evaluateListList` is lambda-form application — the only applicative-order
 * spot in the evaluator: outer args are pre-evaluated (evlis), unlike named
 * actions, which receive raw args (every action is a special form — see
 * ARCHITECTURE.md, divergence 1).
 */
import { Parameters, ExecutorFn, List, Expression } from './sexpr';
import { State } from './environment';
export declare const execNamedAction: (name: string, args: Parameters, st: State) => Promise<Expression>;
/** The single error-wrapping site for executor invocation. */
export declare const execFunction: (fn: ExecutorFn, name: string, args: Parameters, st: State) => Promise<Expression>;
/** Lambda-form application: `[["lambda", ...], arg1, ...]`. */
export declare function evaluateListList(outer_arg0: List, outer_args: List, st: State): Promise<Expression>;
