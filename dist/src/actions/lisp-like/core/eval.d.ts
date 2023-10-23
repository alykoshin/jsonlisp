/** @format */
import { Actions, Parameters, ActionListExecutor, Expression } from '../../../apps/runner/lib/types';
import { State } from '../../../apps/runner/lib/state';
/**
 * @module eval
 */
export declare const execNamedAction: (op: string, args: Parameters, st: State) => Promise<Expression>;
/**
 * @name eval
 */
export declare const eval_: ActionListExecutor;
export declare const actions: Actions;
export default actions;
