import {Actions} from "../../lib/runner";

import definingVariablesAndFunctions from './defining-variables-and-functions'
import operators from './operators'
import errorActions from "./error";
import {when} from "./when";

export const actions: Actions = {
  ...definingVariablesAndFunctions,
  ...errorActions,
  ...operators,
  when,
}

export default actions;


