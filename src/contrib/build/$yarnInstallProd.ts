/** @format */

import {execute} from '../exec';
import {validateArgs} from '../../eval/validate-args';
import {ExecutorFn, Atom, Parameters} from '../../eval/sexpr';
import {State} from '../../eval/environment';

export type YarnInstallProdActionConfig = {
  cwd?: string;
  env?: {[key: string]: string};
};

function installDepsCmd() {
  const program = 'yarn';
  const keys = ['--production=true'];
  return `${program} ${keys.join(' ')}`;
}

/**
 * @module $build
 */

/**
 * @module $yarnInstallProd
 */
export const $yarnInstallProd: ExecutorFn = async function (_, args, state) {
  validateArgs(args, {exactCount: 1});

  const {cwd, env} = args[0] as YarnInstallProdActionConfig;

  const options = {
    cwd,
    env,
  };

  const command_line = installDepsCmd();
  const r = await execute(command_line, options, {state});

  return r.stdout;
};

export default $yarnInstallProd;
