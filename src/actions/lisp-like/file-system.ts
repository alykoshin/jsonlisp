/** @format */

import fs from 'fs/promises';
import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {
  ExecutorFn,
  Actions,
  Parameters,
  T,
  ensureString,
} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';
import path from 'path';

/**
 * @module file-system
 *
 * @see *
 * - The Common Lisp Cookbook – Files and Directories -- Writing content to a file <br>
 * {@link https://lispcookbook.github.io/cl-cookbook/files.html#writing-content-to-a-file} <br>
 * <br>
 * - uiop:copy-file --
 * {@link https://stackoverflow.com/questions/66173218/easiest-way-to-copy-a-file-from-one-directory-to-another-in-common-lisp} <br>
 * - UIOP -- UIOP Manual -- UIOP/FILESYSTEM --
 * {@link https://asdf.common-lisp.dev/uiop.html#UIOP_002fFILESYSTEM} <br>
 * <br>
 * - LispWorks User Guide and Reference Manual > 34 The LISPWORKS Package -- copy-file --
 * {@link http://www.lispworks.com/documentation/lw61/LW/html/lw-893.htm#pgfId-1774263} <br>
 */

/**
 * @name read-file-into-string
 * @see
 * - {@link https://gitlab.common-lisp.net/alexandria/alexandria/-/blob/master/alexandria-1/io.lisp#L75}
 * - Other references:
 *   - The Common Lisp Cookbook – Files and Directories --
 *     {@link https://lispcookbook.github.io/cl-cookbook/files.html#reading-files}  <br>
 *   - UIOP -- UIOP Manual -- UIOP/FILESYSTEM --
 *     {@link https://asdf.common-lisp.dev/uiop.html#index-read_002dfile_002dstring}  <br>
 *   - A modern and consistent Common Lisp string manipulation library -- To and from files -- from-file
 *     {@link https://github.com/vindarel/cl-str#from-file-filename}  <br>
 */
export const readFileIntoString: ExecutorFn = async function (_, args, st) {
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
 * @name write-string-into-file
 * @see
 * - {@link https://gitlab.common-lisp.net/alexandria/alexandria/-/blob/master/alexandria-1/io.lisp#L83}
 * - Other references:
 *   - The Common Lisp Cookbook – Files and Directories --
 *     {@link https://lispcookbook.github.io/cl-cookbook/files.html#writing-content-to-a-file} <br>
 *   - A modern and consistent Common Lisp string manipulation library -- To and from files -- to-file
 *     {@link https://github.com/vindarel/cl-str#to-file-filename-s} <br>
 */
export const writeStringIntoFile: ExecutorFn = async function (
  action,
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

/**
 * @name rename-file
 * @see
 * Common Lisp the Language, 2nd Edition
 * 23.3. Renaming, Deleting, and Other File Operations
 * {@link https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node216.html}
 */
export const renameFile: ExecutorFn = async function (
  action,
  params,
  {evaluate, logger}
) {
  let [source, dest] = validateArgs(params, {exactCount: 2});
  ensureString((source = await evaluate(source)));
  ensureString((dest = await evaluate(dest)));
  source = path.resolve(source);
  dest = path.resolve(dest);
  logger.debug(`"${source}"->"${dest}"`);
  const r = await fs.rename(source, dest);
  logger.debug(`Moved 1 dir/file`);
  return T;
};

/**
 * @name delete-file
 */
export const deleteFile: ExecutorFn = async function (
  action,
  params,
  {evaluate, logger}
) {
  let [source] = validateArgs(params, {exactCount: 1});
  ensureString((source = await evaluate(source)));
  logger.debug(`"${source}"`);
  const p = path.resolve(source);
  const r = await fs.unlink(p);
  logger.debug(`Deleted 1 dir/file`);
  return T;
};

/**
 * @name probe-file
 */
export const probeFile: ExecutorFn = async function (
  action,
  params,
  {evaluate, logger}
) {
  let [source] = validateArgs(params, {exactCount: 1});
  ensureString((source = await evaluate(source)));
  logger.debug(`"${source}"`);
  const p = path.resolve(source);
  let exists = false;
  try {
    const r = await fs.stat(p);
    logger.debug(r);
    exists = true;
  } catch (e) {
    logger.debug('fs.stat:', e as NodeJS.ErrnoException);
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') {
      const e2 = new Error('Unexpected fs.stat() error');
      e2.cause = e;
      throw e2;
    }
  }
  const res = exists ? p : false;
  logger.debug('Result:', res);
  return res;
};

/**
 * @name directory
 * @see
 * - Common Lisp the Language, 2nd Edition --  23.5. Accessing Directories
 * {@link https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node218.html#SECTION002750000000000000000}
 */

export const directory: ExecutorFn = async function (
  action,
  params,
  {evaluate, logger}
) {
  let [source] = validateArgs(params, {exactCount: 1});
  ensureString((source = await evaluate(source)));
  logger.debug(`"${source}"`);
  const p = path.resolve(source);
  const res = await fs.readdir(p /* { encoding, withFileTypes, recursive } */);
  logger.debug('Result:', res);
  return res;
};

export const actions: Actions = {
  'rename-file': renameFile,
  'delete-file': deleteFile,
  'probe-file': probeFile,
  directory: directory,
  'read-file-into-string': readFileIntoString,
  'write-string-into-file': writeStringIntoFile,
};
``;
export default actions;
