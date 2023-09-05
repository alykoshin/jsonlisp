import {execute} from "../lib/exec";
import {FullConfig} from "../lib/config";
import {Runner} from "../lib/runner";
import {ExecAction} from "./exec";

export interface YarnInstallProdAction {
  action: 'yarnInstallProd'
  config: {
    cwd?: string
    env?: { [key: string]: string }
  }
}

function installDepsCmd() {
  const program = 'yarn';
  const keys = [
    '--production=true',
  ];
  return `${program} ${keys.join(' ')}`;
}


export async function action_yarnInstallProd(
  definition: ExecAction,
  {id, fullConfig, runner}: { id: number | string, fullConfig: FullConfig, runner: Runner }
) {
  const {config} = definition;
  const {cwd, env} = config;

  const options = {
    cwd,
    env,
  };

  const command_line = installDepsCmd();
  await execute(command_line, options, {}, (s: number | string) => runner.log(id, s));

}

