import { statSync, existsSync } from 'node:fs';
import * as fs from "node:fs/promises";
import * as path from "path";
import json5 from "json5";

import {ActionDefinition, Actions} from "./runner";


const pkg = require('../../package.json');

type ConfigModes = '.ts' | '.json5' | '.json'
const CONFIG_MODE: ConfigModes = '.ts' // '.json5'; // '.json'

export type FullConfigActions = Actions & {
  default: ActionDefinition
}

export interface FullConfig {
  base_dir: string
  version: string
  actions: FullConfigActions
}

function buildPathname(config_file: string) {
  return path.join(process.cwd(), config_file)
}

export async function readToolsFile(origPathname?: string/*, extname?: string*/): Promise<any> {
  if (!origPathname) {
    return {}
  }

    const extname = path.extname(origPathname);
  // const fileExtname = path.extname(origPathname);
  // if (!extname) {
  //   extname = fileExtname;
  // } else {
  //
  // }
  let pathname;
  let content;
  let data;
  switch (extname) {
    case '.ts':
    case '.js':
      pathname = path.resolve('..', origPathname)
      console.log(`Importing file "${pathname}"`)
      data = (await import(pathname)).default
      break;
    case '.json':
      pathname = path.resolve(__dirname, '..', origPathname)
      console.log(`Reading and parsing file "${pathname}"`)
      content = await fs.readFile(pathname, {encoding: 'utf8'})
      data = JSON.parse(content);
      break;
    case '.json5':
      pathname = path.resolve(__dirname, '..', origPathname)
      console.log(`Reading and parsing file "${pathname}"`)
      content = await fs.readFile(pathname, {encoding: 'utf8'})
      data = json5.parse(content);
      break;
    default:
      throw new Error(`Unsupported extension "${extname}" for "${origPathname}"`)
  }
  // const pathname = options.dataFile
  // const pathname = '../'+options.dataFile
  // const a = await import(pathname)
  // console.log(`readToolsFile:`, data)
  return data;
}


const SUPPORTED_EXTENSIONS = [
  '.ts',
  '.js',
  '.json',
  '.json5',
];
const INDEX_FILE_BASENAME = 'index';

function isDirectory(pathname: string): boolean {
  try {
    return statSync(pathname).isDirectory();
  } catch (e) {
    return false;
  }
}

export async function read_config(config_file: string): Promise<FullConfig> {
  console.log(`Starting filename "${config_file}"`)

  let extname = path.extname(config_file);
  let pathname= buildPathname(config_file);
  if (!extname) {

    // look for 'index' file if directory is passed

    if (isDirectory(pathname)) {
      pathname = path.join(pathname, INDEX_FILE_BASENAME);
      // console.log(`Directory was passed; will look for 'index' file "${pathname}"`)
    }
    // console.log(`Will look for pathname "${pathname}"`)

    // try all supported extensions

    for (const ext of SUPPORTED_EXTENSIONS) {
      if (existsSync(pathname + ext)) {
        extname = ext;
        break;
      }
    }

    if (!extname) {
      throw new Error(`Unable to find source file with any of ${SUPPORTED_EXTENSIONS.join('|')} extnames`)
    }
    pathname = pathname + extname;
  }
  console.log(`Will process as "${extname}"`)

  pathname = path.resolve(pathname);
  console.log(`Final pathname: "${pathname}"`)

  return readToolsFile(pathname);


/*
  if (CONFIG_MODE === '.ts') {

    const pathname= buildPathname(config_file);
    console.log(`Reading and parsing file "${pathname}" as .ts`)

    const module = await import(pathname);
    return module.default;
  } else {

    const pathname= buildPathname(config_file);
    console.log(`Reading and parsing file "${pathname}" as .json/.json5`)

    const content = await fs.readFile(config_file, {encoding: 'utf8'});
    return CONFIG_MODE === '.json5' ? json5.parse(content) : JSON.parse(content);
  }
*/
}

export async function write_config(config_file: string, config: FullConfig) {
  if (CONFIG_MODE === '.ts') {
    const dataContent = JSON.stringify(config, null, 2);

    const fullContent: string = `
import {FullConfig} from "./src/lib/config";

export const config: FullConfig = ${dataContent};

export default config;
`;

    throw new Error('This may overwrite .ts file!');

    await fs.writeFile(buildPathname(config_file), fullContent);

  } else {
    await fs.writeFile(config_file, CONFIG_MODE === '.json5' ? json5.stringify(config, null, 2) : JSON.stringify(config, null, 2));
  }
}

function replace_extname(pathname: string, extname: string) {
  return path.join(path.dirname(pathname), path.basename(pathname, path.extname(pathname)) + extname);
}

export function getConfigFilename(): string {
  // log_data('process.argv:', process.argv)
  let config_file = process.argv[2];

  if (!config_file) {
    config_file = pkg.name + (CONFIG_MODE === '.json5' ? '.json5' : CONFIG_MODE === '.json' ? '.json' : '.ts');
  }
  return config_file;
}



