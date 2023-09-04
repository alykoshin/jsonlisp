import {execute} from "../lib/exec";
import {FullConfig} from "../lib/config";
import {Runner} from "../lib/runner";

export interface ExecAction {
  action: 'exec'
  config: {
    command: string
    cwd: string
    env: { [key: string]: string }
  }
}

export async function action_exec(
  definition: ExecAction,
  {id, fullConfig, runner}: { id: number | string, fullConfig: FullConfig, runner: Runner}
){
  const {config} = definition;
  const {command, cwd, env} = config;
  // const log = (s: number | string) => log_data(s, JSON.stringify(env));

  // const env = {
  //   CONFIG_ENV: config.target, // 'top100',
  // }

  const options = {
    cwd,
    env,
    // // stdio: 'inherit',
    // stdin: 'inherit',
    // stdout: 'pipe',
    // stderr: 'pipe',
  };

  await execute(command, options, {}, (s: number|string) => runner.log(id, s));
}

