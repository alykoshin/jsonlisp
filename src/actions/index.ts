/** @format */

import {Actions} from '../eval/sexpr';

import $sbcl from '../contrib/sbcl';
import $axios from '../contrib/axios';

import buildActions from '../contrib/build';
import lispLike from './lisp-like';
import osActions from '../contrib/os';

export const actions: Actions = {
  ...buildActions,
  ...lispLike,
  ...osActions,
  ...$axios,
};

export default actions;
