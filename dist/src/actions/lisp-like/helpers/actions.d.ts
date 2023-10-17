/** @format */
import { ActionMethodState, Expression } from '../../../apps/runner/lib/types';
export declare const execAction: <A>(name: string, expr: Expression, state: ActionMethodState<A>) => Promise<Expression>;
