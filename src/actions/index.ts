/** @format */

import {Actions} from '../lib/runner';

import $sbcl from './$sbcl';
import buildActions from './build/';
import lispLike from './lisp-like';
import osActions from './os/';

export const actions: Actions = {
  ...buildActions,
  ...lispLike,
  ...osActions,
};

export default actions;
