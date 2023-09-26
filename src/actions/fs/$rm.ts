import fs from 'fs/promises';
import {fn_check_params} from "../../lib/util";
import {ActionMethodState, Parameters} from "../../lib/runner";

export type RmAction = [
  action: 'rm',
  ...files: string[],
  // dry?: boolean,
]

export async function $rm(
  action: string,
  parameters: Parameters,
  state: ActionMethodState
): Promise<void> {
  const {runner, logger} = state;
  fn_check_params(parameters, {minCount: 1})

  for (let pf of parameters) {
    const pathname = await runner.eval(pf, state);
    const sPathname = String(pathname)
    logger.debug(`[rm] deleting file "${sPathname}"`)

    // if (dry) {
    //   runner.debug({id, level}, `[rm] "dry" flag is set; skipping`);
    // } else {
    await fs.rm(sPathname);
    // }
  }
  logger.debug(`[cp] deleted ${parameters.length} dirs/files`)
}

export default $rm;
