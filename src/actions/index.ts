/** @format */

import {Actions} from '../apps/runner/lib/types';

import $sbcl from './$sbcl';
import $axios from './$axios';

import buildActions from './build/';
import lispLike from './lisp-like';
import osActions from './os/';

export const actions: Actions = {
  ...buildActions,
  ...lispLike,
  ...osActions,
  ...$axios,
};

export default actions;
