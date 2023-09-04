import {ActionDefinition} from "./index";

import {FullConfig} from "../lib/config";
import {Runner} from "../lib/runner";
import {ExecAction} from "./exec";

export interface ParallelAction {
  action: 'parallel'
  actions: ActionDefinition[]
}

export type ParallelMultiAction = [
  action: 'parallel',
  ...actions: ActionDefinition[],
]

export async function action_parallel(
  definition: ParallelAction | ParallelMultiAction,
  {id, fullConfig, runner}: { id: number | string, fullConfig: FullConfig, runner: Runner}
) {
  let actions;
  if (Array.isArray(definition)) {
    const [_action, ..._actions] = definition;
    actions = _actions;
  } else {
    actions = definition.actions;
  }
  const promises = actions.map(a => runner.execute(a, fullConfig));
  // }
  return await Promise.all(promises);
}
