import {Actions} from "../../lib/runner";

import conditionals from "./conditionals";
import definingVariablesAndFunctions from './defining-variables-and-functions'
import errorActions from "./error";
import listFunctions from './list-functions'
import operators from './operators'

export const actions: Actions = {
  ...conditionals,
  ...definingVariablesAndFunctions,
  ...errorActions,
  ...operators,
  ...listFunctions,
}

export default actions;
