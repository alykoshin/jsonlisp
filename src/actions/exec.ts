import {execute} from "../helpers/exec";
import {fn_check_params} from "../lib/util";
import {ActionMethodState, Parameters} from "../lib/runner";

type ExecActionConfig = {
  cwd: string,
  env: {
    [key: string]: string,
  }
}

export async function exec(
  action: string,
  parameters: Parameters,
  {id, level, fullConfig, runner, logger}: ActionMethodState
) {
  fn_check_params(parameters, {minCount: 1})

  const lastParam = parameters[parameters.length - 1]
  let config: Object = {};
  if (typeof lastParam === 'object' && lastParam !== null) {
    config = lastParam;
    parameters = parameters.slice(0, parameters.length - 1)
  }

  const {cwd, env} = config as ExecActionConfig || {};

  const result = [];
  for (const p of parameters) {

    const command = await runner.eval(p, fullConfig, {level, logger});
    const sCommand = String(command);

    const options = {
      cwd,
      env,
      // // stdio: 'inherit',
      // stdin: 'inherit',
      // stdout: 'pipe',
      // stderr: 'pipe',
    };

    const res = await execute(sCommand, options, {
      log: (s: number | string) => logger.log(s),
      debug: (s: number | string) => logger.debug(s),
    });

    result.push(res);
  }
  return result;
}

export default exec
