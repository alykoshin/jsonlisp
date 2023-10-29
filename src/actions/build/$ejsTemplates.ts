/** @format */

import path from 'path';
import fs from 'fs/promises';
import ejs from 'ejs';

import {getFilesRecursive} from '../../lib/fileUtils/fileUtils';
import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {ExecutorFn, Parameter, Parameters} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';

const DEBUG = false;

export type EjsTemplatesActionConfig = {
  sourceDir: string;
  excludeDirs: string | string[];
  targetDir: string;
};

// export type EjsTemplatesAction = [
//   action: 'ejsTemplates',
//   config: EjsTemplatesActionConfig
// ]

/**
 * @module $build
 */

/**
 * @name $ejsTemplates
 */
export const $ejsTemplates: ExecutorFn = async function (_, args, state) {
  const {runner, logger} = state;
  validateArgs(args, {exactCount: 1});

  const {
    sourceDir,
    excludeDirs: excludeDirs_,
    targetDir,
  } = args[0] as EjsTemplatesActionConfig;
  const excludeDirs = Array.isArray(excludeDirs_)
    ? excludeDirs_
    : [excludeDirs_];

  const PROJECT_ROOT_DIR = '.';

  //const ejsDefaultConfig = require(path.resolve(PROJECT_ROOT_DIR, 'ejs-defaults.json'));
  //const ejsDefaultConfig = await import(path.resolve(PROJECT_ROOT_DIR, 'ejs-defaults.json'), { assert: { type: "json" } });
  const ejsDefaultConfig = await fs
    .readFile(path.resolve(PROJECT_ROOT_DIR, 'ejs-defaults.json'), {
      encoding: 'utf8',
    })
    .then(JSON.parse);

  const ejsDefaultOptions = {
    root: PROJECT_ROOT_DIR, //views: [ path.resolve(PROJECT_ROOT_DIR, 'src') ],
    rmWhitespace: !DEBUG,
  };

  const ejsFiles = await getFilesRecursive(sourceDir, {
    extnames: '.ejs',
    excludeDirs,
  });
  //const ejsFiles = [
  //  'D:\\teach\\05. МИСиС. 1.01. Веб-разработка\\presentations2\\src\\00-contents\\index.ejs',
  //  ]
  //console.log(ejsFiles)

  // for (let i in ejsFiles) {
  for (const currSourcePathname of ejsFiles) {
    // const currSourcePathname = ejsFiles[i]
    const currSourceDir = path.dirname(currSourcePathname);
    const currRelDir = path.relative(currSourceDir, currSourceDir);
    const currTargetDir = path.resolve(targetDir, currRelDir);
    const currSourceFilename = path.basename(currSourcePathname);
    const currTargetFilename =
      path.basename(currSourcePathname, path.extname(currSourcePathname)) +
      '.html';
    const currTargetPathname = path.resolve(currTargetDir, currTargetFilename);
    //console.log(currSourcePathname, '>>>', currTargetPathname);
    //
    await fs.mkdir(currTargetDir, {recursive: true});
    //
    const src = await fs.readFile(currSourcePathname, 'utf8');
    //
    const ejsOptions = Object.assign({}, ejsDefaultOptions, {
      root: currSourceDir,
      views: [currSourceDir],
      rmWhitespace: false, //!DEBUG,  <-- must be off to allow markdown indents to work
    });
    const ejsConfig = Object.assign({}, ejsDefaultConfig, {});

    let html = ejs.render(src, ejsConfig, ejsOptions);
    //console.log(html)
    //
    await fs.writeFile(currTargetPathname, html, 'utf8');
  }
  return true;
};

export default $ejsTemplates;
