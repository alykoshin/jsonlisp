/** @format */

// import {actions as $versionActions} from '../build/$version';
import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {
  Actions,
  EvaluateFn,
  ExecutorFn,
  ensureString,
} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';
import {formatFilenameDate} from '../../lib/fileUtils/fileUtils';
import {sevenZip, type SevenZipOptions} from './helpers/7zip';
import {zipDirectory} from './helpers/archiver';
import {stat} from 'fs';

async function getVersion(evaluate: EvaluateFn): Promise<string> {
  // const version = await ($versionActions.$version as ExecutorFn).call(
  //   state,
  //   action,
  //   [],
  //   state
  // );
  const version = await evaluate('$version');
  ensureString(version);
  return version;
}

function getArchiveBasename(archive_prefix: string, version: string): string {
  return [archive_prefix, `v${version}`, formatFilenameDate()].join('-');
}

/**
 * @module $zip
 */

/**
 * @name $zip
 * @description Uses `7zip` executable to create zip archive (*Windows* only).
 */
export const $zip: ExecutorFn = async function (_, args, st): Promise<string> {
  // const {runner, logger} = st;
  validateArgs(args, {exactCount: 1});
  const options = args[0] as SevenZipOptions;

  const version = await getVersion(st.evaluate);
  const {archive_prefix} = options;
  const archiveBaseName = getArchiveBasename(archive_prefix, version);

  return sevenZip(archiveBaseName, options, st);
};

/**
 * @name $zipDir
 * @description Uses `archiver` module to create zip archive.
 */
export const $zipDir: ExecutorFn = async function (
  _,
  args,
  st
): Promise<string> {
  // const {runner, logger} = st;
  validateArgs(args, {exactCount: 3});
  const [sourceDir, out_dir, archive_prefix] = args;
  ensureString(sourceDir);
  ensureString(out_dir);
  ensureString(archive_prefix);

  const version = await getVersion(st.evaluate);
  const archiveBaseName = getArchiveBasename(archive_prefix, version);

  const finalName = await zipDirectory(
    sourceDir,
    out_dir,
    archiveBaseName,
    st.logger
  );
  return finalName;
};

export const actions: Actions = {
  $zip: $zip,
  $zipDir: $zipDir,
  // 'zip:get-name': getArchiveBasename,
};

export default actions;
