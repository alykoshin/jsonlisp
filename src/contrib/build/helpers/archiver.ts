/** @format */

import * as fs from 'fs';
import createArchiver from 'archiver';
import {ILogger} from '../../../lib/log';
import path from 'path';

/**
 * @param {String} sourceDir
 * @param {String} out
 * @returns {Promise}
 */
export async function zipDirectory(
  sourceDir: string,
  out_dir: string,
  outBasename: string,
  lgr: ILogger
): Promise<string> {
  const archiver = createArchiver('zip', {zlib: {level: 9}});
  const outPathname = path.join(out_dir, outBasename + '.zip');
  const lambdaStream = fs.createWriteStream(outPathname);

  return new Promise((resolve, reject) => {
    archiver
      //.directory(source, false)
      .glob(sourceDir)
      .on('error', (err) => reject(err))
      // https://archiverjs.com/docs/global.html#EntryData
      .on('entry', (entryData) => {
        lgr.debug('>>> ', entryData.name);
      })
      .on('progress', (progressData) => {
        const {processed: pf, total: tf} = progressData.entries;
        const {processedBytes: pb, totalBytes: tb} = progressData.fs;
        lgr.debug(`>>> ${pf} of ${tf} files (${pb} of approx ${tb} bytes) `);
      })
      .on('close', () => lgr.log(`total bytes: ${archiver.pointer}`))
      .pipe(lambdaStream);

    lambdaStream.on('close', () => resolve(outPathname));
    archiver.finalize();
  });
}
