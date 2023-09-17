import { fn_check_params } from "../../lib/util";
import {ActionMethodState, Parameters} from "../../lib/runner";


export async function time(
  action: string,
  parameters: Parameters,
  {id, level, fullConfig, runner,logger}: ActionMethodState
) {
  fn_check_params(parameters, {exactCount: 1})
  const [pDuration] = parameters;

  const startTime = new Date();

  const value = await runner.eval(pDuration, fullConfig, {level, logger});

  const endTime = new Date();
  const duration = endTime.getTime() - startTime.getTime();

  logger.log(`Evaluation took:\n  ${duration / 1000} seconds of real time`);

  return value;
}

export default time;
