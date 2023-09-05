import {FullConfig} from "../lib/config";
import {ExecAction} from "./exec";
import {Runner} from "../lib/runner";

export interface BuildAction {
  action: 'build'
  config: {
    cwd: string
    env: { [key: string]: string }
  }
}

export async function action_build(
  definition: BuildAction,
  {id, fullConfig, runner}: { id: number | string, fullConfig: FullConfig, runner: Runner }
) {

  const command = `webpack --mode production`;

  /*
  const {base_dir, env} = actionDefinition.config;

  const options = {
    cwd: base_dir,
    env: env || {},
    // // stdio: 'inherit',
    // stdin: 'inherit',
    // stdout: 'pipe',
    // stderr: 'pipe',
  };


  await execute(command, options, {
    log: (s: number|string) => runner.log(id, s),
    debug: (s: number|string) => runner.debug(id, s),
  });
*/

  const execDefinition: ExecAction = {
    action: 'exec',
    config: {
      ...definition.config,
      command,
    },
  }
  await runner.execute(execDefinition, fullConfig);

}
