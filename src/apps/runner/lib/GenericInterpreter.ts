/** @format */

import {ActionMethodState, Actions, Expression} from './types';

export interface GenericActionMethodState {
  evaluate: (p: Expression) => Promise<Expression>;
}

export abstract class GenericInterpreter {
  abstract actions: Actions;
  abstract evaluate(
    p: Expression,
    state?: GenericActionMethodState
  ): Promise<Expression>;
}
