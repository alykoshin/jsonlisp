/** @format */

import {validateArgs} from '../eval/validate-args';
import {Actions, ExecutorFn, ensureList} from '../eval/sexpr';

/**
 * @module cl/sequences
 * CLHS chapter 17 "Sequences".
 * (`concatenate` is documented in old notes but was never implemented.)
 */

/** @name length */
export const length: ExecutorFn = async (_, args, st) => {
  validateArgs(args, {exactCount: 1});
  const a0 = await st.evaluate(args[0]);
  ensureList(a0);
  return a0.length;
};

export const actions: Actions = {
  length,
};

export default actions;
