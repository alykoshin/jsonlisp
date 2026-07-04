/** @format */

import fs from 'fs/promises';
import path from 'path';
import {validateArgs} from '../eval/validate-args';
import {Actions, ExecutorFn, ensureString} from '../eval/sexpr';
import {T} from '../kernel/booleans';

/**
 * @module cl/files
 * ANSI file operations — CLHS chapter 20 "Files" (plus `directory` access,
 * CLtL2 23.5). Non-ANSI file helpers live in quicklisp/alexandria and
 * quicklisp/str.
 */

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

/**
 * @name ensure-directories-exist
 * @see
 * - Common Lisp HyperSpec --
 * {@link http://www.ai.mit.edu/projects/iiip/doc/CommonLISP/HyperSpec/Body/fun_ensure-di_tories-exist.html}
 * - The Common Lisp Cookbook – Files and Directories --  Creating directories
 * {@link https://lispcookbook.github.io/cl-cookbook/files.html#creating-directories}
 */
export const ensureDirectoriesExist: ExecutorFn = async function (
  action,
  params,
  {evaluate, logger}
) {
  let [source] = validateArgs(params, {exactCount: 1});
  ensureString((source = await evaluate(source)));
  logger.debug(`"${source}"`);
  const p = path.resolve(source);
  const res = await fs.mkdir(p, {recursive: true});
  return res;
};

export const actions: Actions = {
  'rename-file': renameFile,
  'delete-file': deleteFile,
  'probe-file': probeFile,
  directory: directory,
  'ensure-directories-exist': ensureDirectoriesExist,
};

export default actions;
