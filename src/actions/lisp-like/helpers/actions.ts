/** @format */

import {
  ActionMethodState,
  Actions,
  Atom,
  Expression,
  ensureFunction,
} from '../../../apps/runner/lib/types';
import {MicroAtom} from '../../../apps/runner/microRunner';

export const execAction = function <A>(
  // actions: Actions,
  name: string,
  expr: Expression,
  state: ActionMethodState<A>
): Promise<Expression> {
  const fn = state.actions[name];
  ensureFunction(fn, `function "${name}" not defined`);
  const res = (fn as Function)(name, [expr], state);
  return res;
};
