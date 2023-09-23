import {execute} from "../../helpers/exec";
import {fn_check_params} from "../../lib/util";
import {ActionMethodState, Parameters} from "../../lib/runner";

export type YarnInstallProdActionConfig = {
  cwd?: string
  env?: { [key: string]: string }
}

function installDepsCmd() {
  const program = 'yarn';
  const keys = [
    '--production=true',
  ];
  return `${program} ${keys.join(' ')}`;
}

export async function $yarnInstallProd(
  action: string,
  parameters: Parameters,
  state: ActionMethodState
) {
  const {runner, logger} = state;
  fn_check_params(parameters, {exactCount: 1})

  const {cwd, env} = parameters[0] as YarnInstallProdActionConfig;

  const options = {
    cwd,
    env,
  };

  const command_line = installDepsCmd();
  await execute(command_line, options, {
    log: (s: number | string) => logger.log(s),
    debug: (s: number | string) => logger.debug(s),
  });

}

export default $yarnInstallProd;
