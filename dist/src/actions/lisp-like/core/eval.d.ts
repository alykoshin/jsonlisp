/** @format */
import { Actions, Parameters, ExecutorFn, Expression } from '../helpers/types';
import { State } from '../../../apps/runner/lib/state';
/**
 * @module eval
 */
export declare const execNamedAction: (op: string, args: Parameters, st: State) => Promise<Expression>;
export declare const execFunction: (fn: ExecutorFn, name: string, args: Parameters, st: State) => Promise<Expression>;
/**
 * @name eval
 */
export declare const eval_: ExecutorFn;
export declare const actions: Actions;
export default actions;
