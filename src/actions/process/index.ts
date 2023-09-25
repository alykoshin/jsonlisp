import {Actions} from "../../lib/runner";

import series from './$series'
import parallel from './$parallel'

export const actions: Actions = {
  ...parallel,
  ...series,
}

export default actions;




