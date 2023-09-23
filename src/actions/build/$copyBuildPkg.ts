import {fn_check_params} from "../../lib/util";
import {ActionMethodState, Parameters} from "../../lib/runner";

export async function $copyBuildPkg(
  action: string,
  parameters: Parameters,
  state: ActionMethodState
) {
  const {runner, logger} = state;
  fn_check_params(parameters, {exactCount: 0})
  throw new Error(`Not implemented`);
}

export default $copyBuildPkg
