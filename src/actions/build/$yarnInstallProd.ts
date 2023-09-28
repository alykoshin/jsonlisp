/** @format */

import {execute} from '../lisp-like/helpers/exec';
import {fn_check_params} from '../../lib/util';
import {ActionMethodState, Parameters} from '../../lib/runner';

export type YarnInstallProdActionConfig = {
  cwd?: string;
  env?: {[key: string]: string};
};

function installDepsCmd() {
  const program = 'yarn';
  const keys = ['--production=true'];
  return `${program} ${keys.join(' ')}`;
}

export async function $yarnInstallProd(
  action: string,
  params: Parameters,
  {logger}: ActionMethodState
) {
  fn_check_params(params, {exactCount: 1});

  const {cwd, env} = params[0] as YarnInstallProdActionConfig;

  const options = {
    cwd,
    env,
  };

  const command_line = installDepsCmd();
  const r = await execute(command_line, options, {logger});

  return r.stdout;
}

export default $yarnInstallProd;
