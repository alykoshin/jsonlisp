import {Actions} from "../lib/runner";

import $sbcl from "./$sbcl";
import buildActions from './build/'
import fsActions from './fs/'
import lispLike from './lisp-like'
import $miscActions from "./misc/";
import osActions from './os/'
import $processActions from "./process/";

export const actions: Actions = {
  ...buildActions,
  ...fsActions,
  ...lispLike,
  ...$miscActions,
  ...osActions,
  ...$processActions,
}

export default actions;




