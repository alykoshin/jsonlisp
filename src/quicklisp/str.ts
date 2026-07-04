/** @format */

import fs from 'fs/promises';
import path from 'path';
import {validateArgs} from '../eval/validate-args';
import {Actions, ExecutorFn, ensureString} from '../eval/sexpr';

/**
 * @module quicklisp/str
 * cl-str — "A modern and consistent Common Lisp string manipulation library"
 * {@link https://github.com/vindarel/cl-str}
 * Package prefix `str:` is part of the historical action names.
 */

/**
 * @name str:from-file
 * @see
 * - {@link https://github.com/vindarel/cl-str#from-file-filename}
 * - {@link https://lispcookbook.github.io/cl-cookbook/files.html#reading-files}
 */
export const strFromFile: ExecutorFn = async function (_, args, st) {
  let [pFname] = validateArgs(args, {exactCount: 1});

  let fname = await st.evaluate(pFname);
  ensureString(fname);
  fname = path.resolve(fname);
  st.logger.debug(`reading "${fname}"`);

  const s = await fs.readFile(fname, {encoding: 'utf8'});
  st.logger.debug(`Read ${s.length} chars`);
  return s;
};

/**
 * @name str:to-file
 * @see
 * - {@link https://github.com/vindarel/cl-str#to-file-filename-s} <br>
 * - {@link https://lispcookbook.github.io/cl-cookbook/files.html#writing-content-to-a-file} <br>
 */
export const strToFile: ExecutorFn = async function (
  _,
  params,
  {evaluate, logger}
) {
  let [pFname, s] = validateArgs(params, {exactCount: 2});

  let fname = await evaluate(pFname);
  ensureString(fname);
  fname = path.resolve(fname);
  logger.debug(`writing to "${fname}"`);

  ensureString((s = await evaluate(s)));
  await fs.writeFile(fname, s, {encoding: 'utf8'});

  logger.debug(`Wrote ${s.length} chars`);
  return s;
};

export const actions: Actions = {
  'str:to-file': strToFile,
  'str:from-file': strFromFile,
};

export default actions;
