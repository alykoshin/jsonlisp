import {fn_check_params} from "../../lib/util";
import {ActionDefinition, ActionMethodState, Parameter, Parameters} from "../../lib/runner";

export type WhenAction = [
  action: 'when',
  testClause: Parameter,
  actionWhenTrue: ActionDefinition,
]

export async function when(
  action: string,
  parameters: Parameters,
  state: ActionMethodState
) {
  const {runner, logger} = state;
  fn_check_params(parameters, {exactCount: 2});
  const [testClause, actionWhenTrue] = parameters;

  const condition = await runner.eval(testClause, state);
  logger.debug(`when: condition: `+ JSON.stringify(condition))
  if (condition) {
    return await runner.eval(actionWhenTrue, state);
  }
}

export default when;
