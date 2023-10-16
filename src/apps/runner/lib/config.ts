/** @format */

import json5 from 'json5';
import {existsSync, statSync} from 'node:fs';
import * as fs from 'node:fs/promises';
import * as path from 'path';

import {ActionDefinition, Actions} from './types';

const pkg = require('../../package.json');

type ConfigModes = '.ts' | '.json5' | '.json';
// const CONFIG_MODE: ConfigModes = '.ts' // '.json5'; // '.json'

export type ActivityActionsDefinition = Actions & {
  default: ActionDefinition;
};

export interface Activity {
  base_dir: string;
  version: string;
  actions: ActivityActionsDefinition;
}

function replace_extname(pathname: string, extname: string) {
  return path.join(
    path.dirname(pathname),
    path.basename(pathname, path.extname(pathname)) + extname
  );
}

function isDirectory(pathname: string): boolean {
  try {
    return statSync(pathname).isDirectory();
  } catch (e) {
    return false;
  }
}

function buildPathname(filename: string) {
  const baseDir = process.cwd();
  const pathname = path.join(baseDir, filename);
  return path.resolve(pathname);
}

const SUPPORTED_EXTENSIONS = ['.ts', '.js', '.json', '.json5'];
const INDEX_FILE_BASENAME = 'index';

class ConfigReader {
  resolveFilename(pathname: string): string {
    // let pathname = buildPathname(fname)
    let extname = path.extname(pathname);
    if (!extname) {
      /**
       * look for 'index' file if the path to directory was passed
       */
      if (isDirectory(pathname)) {
        pathname = path.join(pathname, INDEX_FILE_BASENAME);
        // console.log(`Directory was passed; will look for 'index' file "${pathname}"`)
      }
      // console.log(`Will look for pathname "${pathname}"`)

      /**
       * try all supported extensions
       */
      for (const ext of SUPPORTED_EXTENSIONS) {
        if (existsSync(pathname + ext)) {
          extname = ext;
          break;
        }
      }

      if (!extname) {
        const exts = SUPPORTED_EXTENSIONS.join('|');
        const msg = `Unable to find source file with any of ${exts} extnames`;
        throw new Error(msg);
      }
      pathname = pathname + extname;
    }
    console.log(`Will process as "${extname}", Final pathname: "${pathname}"`);
    return pathname;
  }

  async read(origPathname?: string): Promise<any> {
    if (!origPathname) throw new Error('Pathname expected');

    const extname = path.extname(origPathname);
    // const baseDir = process.cwd()
    let pathname = buildPathname(origPathname);
    switch (extname) {
      case '.ts':
        return configReader.readTs(pathname);
      case '.js':
        return configReader.readJs(pathname);
      case '.json':
        return configReader.readJson(pathname);
      case '.json5':
        return configReader.readJson5(pathname);
      default:
        const msg = `Unsupported extension "${extname}" for "${origPathname}"`;
        throw new Error(msg);
    }
  }

  async readTs(pathname: string): Promise<any> {
    console.log(`Importing file "${pathname}"`);
    const data = (await import(pathname)).default;
    return data;
  }

  async readJs(pathname: string): Promise<any> {
    return this.readTs(pathname);
  }

  async readJson(pathname: string): Promise<any> {
    console.log(`Reading and parsing file "${pathname}"`);
    const content = await fs.readFile(pathname, {encoding: 'utf8'});
    return JSON.parse(content);
  }

  async readJson5(pathname: string): Promise<any> {
    console.log(`Reading and parsing file "${pathname}"`);
    const content = await fs.readFile(pathname, {encoding: 'utf8'});
    return json5.parse(content);
  }
}

export const configReader = new ConfigReader();

export async function readActivityFile(fname: string): Promise<Activity> {
  console.log(`Starting filename "${fname}"`);

  const pathname = configReader.resolveFilename(fname);
  return configReader.read(pathname);
}

class ConfigWriter {
  async write(config_file: string, config: Activity) {
    const extname = path.extname(config_file);
    const baseDir = process.cwd();
    // const pathname = path.resolve(baseDir, config_file)
    const pathname = buildPathname(config_file);
    switch (extname) {
      case '.ts':
        return configWriter.writeTs(pathname, config);
      case '.json':
        return configWriter.writeJson(pathname, config);
      case '.json5':
        return configWriter.writeJson5(pathname, config);
    }
  }

  async writeTs(pathname: string, data: any): Promise<void> {
    const content = JSON.stringify(data, null, 2);

    const fullContent: string = `
import {FullConfig} from "./src/lib/config";

export const config: FullConfig = ${content};

export default config;
`;

    throw new Error('This may overwrite .ts file!');

    return await fs.writeFile(pathname, fullContent);
  }

  async writeJson(pathname: string, data: any): Promise<void> {
    const content = JSON.stringify(data, null, 2);
    return await fs.writeFile(pathname, content);
  }

  async writeJson5(pathname: string, data: any): Promise<void> {
    const content = json5.stringify(data, null, 2);
    return await fs.writeFile(pathname, content);
  }
}

export const configWriter = new ConfigWriter();
