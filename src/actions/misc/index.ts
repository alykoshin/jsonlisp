import {Actions} from "../../lib/runner";

import $expect from "./$expect";
import $help from './$help'

export const actions: Actions = {
  ...$expect,
  ...$help,
}

export default actions;
