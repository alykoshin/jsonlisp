import {Actions} from "../../lib/runner";

import conditionals from "./conditionals";
import defines from './defines'
import errorActions from "./error";
import inputOutput from "./input-output";
import listFunctions from './lists'
import operators from './operators'
import system from './system'

export const actions: Actions = {
  ...conditionals,
  ...defines,
  ...errorActions,
  ...inputOutput,
  ...listFunctions,
  ...operators,
  ...system,
}

export default actions;
