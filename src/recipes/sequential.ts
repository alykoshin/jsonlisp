import {FullConfig} from '../lib/config'
import {ActionDefinition, BaseActionConfig} from "./";
import {Runner} from "../lib/runner";

export interface SequentialAction extends BaseActionConfig {
  action: 'sequential'
  actions: ActionDefinition[]
}

export type SequentialMultiAction = [
  action: 'sequential',
  ...actions: ActionDefinition[],
]

export async function action_sequential(
  definition: SequentialAction | SequentialMultiAction,
  {id, fullConfig, runner}: { id: number | string, fullConfig: FullConfig, runner: Runner}
) {
  let actions;
  if (Array.isArray(definition)) {
    const [_action, ..._actions] = definition;
    actions = _actions;
  } else {
    actions = definition.actions;
  }
  for (const subActionConfig of actions) {
    // const {action} = baseActionConfig;
    // log(action);
    await runner.execute(subActionConfig, fullConfig);
  }
}
