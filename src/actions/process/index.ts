import {Actions} from "../../lib/runner";

import {series} from './series'
import {sleep} from './sleep'
import {parallel} from './parallel'
import {time} from "./time";

export const actions: Actions = {
  parallel,
  series,
  sleep,
  time,
}




