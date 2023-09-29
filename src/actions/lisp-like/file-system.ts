/** @format */

import fs from 'fs/promises';
import {fn_check_params} from '../../lib/util';
import {ActionMethodState, Actions, Parameters} from '../../lib/runner';
import path from 'path';

/**
 * The Common Lisp Cookbook – Files and Directories -- Writing content to a file
 * https://lispcookbook.github.io/cl-cookbook/files.html#writing-content-to-a-file
 *
 * uiop:copy-file
 * https://stackoverflow.com/questions/66173218/easiest-way-to-copy-a-file-from-one-directory-to-another-in-common-lisp
 * UIOP -- UIOP Manual -- UIOP/FILESYSTEM --
 * https://asdf.common-lisp.dev/uiop.html#UIOP_002fFILESYSTEM
 *
 *  LispWorks User Guide and Reference Manual > 34 The LISPWORKS Package -- copy-file
 * http://www.lispworks.com/documentation/lw61/LW/html/lw-893.htm#pgfId-1774263
 */

export const actions: Actions = {
  /**
   * Common Lisp the Language, 2nd Edition
   * 23.3. Renaming, Deleting, and Other File Operations
   * https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node216.html
   */

  'rename-file': async function (action, params, {evaluate, logger}) {
    fn_check_params(params, {exactCount: 2});
    const [source, dest] = params;

    logger.debug(`"${source}"->"${dest}"`);
    const r = await fs.rename(
      String(await evaluate(source)),
      String(await evaluate(dest))
    );
    logger.debug(`Moved 1 dir/file`);
  },
  'delete-file': async function (action, params, {evaluate, logger}) {
    fn_check_params(params, {exactCount: 1});
    const [source] = params;

    logger.debug(`"${source}"`);
    const r = await fs.unlink(String(await evaluate(source)));
    logger.debug(`Deleted 1 dir/file`);
    return;
  },
  'probe-file': async function (action, params, {evaluate, logger}) {
    fn_check_params(params, {exactCount: 1});
    const [source] = params;

    logger.debug(`"${source}"`);
    const p = path.resolve(String(await evaluate(source)));
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
  },

  /**
   * Common Lisp the Language, 2nd Edition
   * 23.5. Accessing Directories
   * https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node218.html#SECTION002750000000000000000
   */

  directory: async function (action, params, {evaluate, logger}) {
    fn_check_params(params, {exactCount: 1});
    const [source] = params;

    logger.debug(`"${source}"`);
    const p = path.resolve(String(await evaluate(source)));

    const res = await fs.readdir(
      p /* { encoding, withFileTypes, recursive } */
    );

    logger.debug('Result:', res);
    return res;
  },
};

export default actions;
