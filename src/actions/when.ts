import {fn_check_params} from "../lib/util";
import {ActionDefinition, ActionMethodState, Parameter, Parameters} from "../lib/runner";

export type WhenAction = [
  action: 'when',
  testClause: Parameter,
  actionWhenTrue: ActionDefinition,
]

export async function when(
  action: string,
  parameters: Parameters,
  {id, level, fullConfig, runner, logger}: ActionMethodState
) {
  fn_check_params(parameters, {exactCount: 2});
  const [testClause, actionWhenTrue] = parameters;

  const condition = await runner.eval(testClause, fullConfig, {level, logger});
  logger.debug(`when: condition: `+ JSON.stringify(condition))
  if (condition) {
    return await runner.eval(actionWhenTrue, fullConfig, {level, logger});
  }
}

export default when;
