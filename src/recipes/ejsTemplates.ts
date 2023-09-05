//(async function run() {
import path from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs/promises';
import ejs from 'ejs';
import {getFilesRecursive} from "../lib/fsUtils";
import {FullConfig} from "../lib/config";
import {Runner} from "../lib/runner";

const DEBUG = false;

export interface EjsTemplatesAction {
  action: 'ejsTemplates'
  sourceDir: string
  excludeDirs: string | string[]
  targetDir: string
}


export async function action_ejsTemplates(
  definition: EjsTemplatesAction,
  {id, fullConfig, runner}: { id: number | string, fullConfig: FullConfig, runner: Runner }
) {
  const excludeDirs = Array.isArray(definition.excludeDirs) ? definition.excludeDirs : [definition.excludeDirs];


  const PROJECT_ROOT_DIR = '.'

  //const ejsDefaultConfig = require(path.resolve(PROJECT_ROOT_DIR, 'ejs-defaults.json'));
  //const ejsDefaultConfig = await import(path.resolve(PROJECT_ROOT_DIR, 'ejs-defaults.json'), { assert: { type: "json" } });
  const ejsDefaultConfig = await fs.readFile(path.resolve(PROJECT_ROOT_DIR, 'ejs-defaults.json'), {encoding: 'utf8'}).then(JSON.parse);

  const ejsDefaultOptions = {
    root: PROJECT_ROOT_DIR, //views: [ path.resolve(PROJECT_ROOT_DIR, 'src') ],
    rmWhitespace: !DEBUG,
  }

  const ejsFiles = await getFilesRecursive(definition.sourceDir, {
    extnames: '.ejs',
    excludeDirs,
  })
  //const ejsFiles = [
  //  'D:\\teach\\05. МИСиС. 1.01. Веб-разработка\\presentations2\\src\\00-contents\\index.ejs',
  //  ]
  //console.log(ejsFiles)

  // for (let i in ejsFiles) {
  for (const sourcePathname of ejsFiles) {
    // const sourcePathname = ejsFiles[i]
    const sourceDir = path.dirname(sourcePathname)
    const relDir = path.relative(definition.sourceDir, sourceDir)
    const targetDir = path.resolve(definition.targetDir, relDir)
    const sourceFilename = path.basename(sourcePathname);
    const targetFilename = path.basename(sourcePathname, path.extname(sourcePathname)) + '.html';
    const targetPathname = path.resolve(targetDir, targetFilename);
    //console.log(sourcePathname, '>>>', targetPathname);
    //
    await fs.mkdir(targetDir, {recursive: true});
    //
    const src = await fs.readFile(sourcePathname, 'utf8')
    //
    const ejsOptions = Object.assign({}, ejsDefaultOptions, {
      root: definition.sourceDir,
      views: [sourceDir],
      rmWhitespace: false, //!DEBUG,  <-- must be off to allow markdown indents to work
    });
    const ejsConfig = Object.assign({}, ejsDefaultConfig, {});

    let html = ejs.render(src, ejsConfig, ejsOptions);
    //console.log(html)
    //
    await fs
      .writeFile(targetPathname, html, 'utf8');
  }
}

