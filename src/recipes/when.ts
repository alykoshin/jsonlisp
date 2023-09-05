import {FullConfig} from '../lib/config'
import {ActionDefinition, BaseActionConfig} from "./";
import {Runner} from "../lib/runner";

export type WhenAction = [
  action: 'sequential',
  testClause: boolean,
  action: ActionDefinition,
]

export async function action_when(
  definition: WhenAction,
  {id, fullConfig, runner}: { id: number | string, fullConfig: FullConfig, runner: Runner}
) {
  if (definition[1]) {
    await runner.execute(definition[2], fullConfig);
  }
}
