/** @format */

import json5 from 'json5';
import * as fs from 'node:fs/promises';
import * as path from 'path';

import {ActionDefinition, Actions} from './types';

import {
  readUniversal,
  resolveFilename,
  writeUniversal,
} from '../../../lib/fileUtils/read-write/universalFileUtils';
import {buildPathname} from '../../../lib/fileUtils/fileUtils';

// type ConfigModes = '.ts' | '.json5' | '.json';
// const CONFIG_MODE: ConfigModes = '.ts' // '.json5'; // '.json'

export type ActivityActionsDefinition = Actions & {
  default: ActionDefinition;
};

export interface Activity {
  base_dir: string;
  version: string;
  actions: ActivityActionsDefinition;
}

class ConfigReader {
  async read(origPathname?: string): Promise<any> {
    if (!origPathname) throw new Error('Pathname expected');
    let pathname = buildPathname(origPathname);
    return readUniversal(pathname);
  }
}

export const configReader = new ConfigReader();

export async function readActivityFile(fname: string): Promise<Activity> {
  console.log(`Starting filename "${fname}"`);
  const pathname = resolveFilename(fname);
  return configReader.read(pathname);
}

class ConfigWriter {
  async write(config_file: string, config: Activity) {
    const pathname = buildPathname(config_file);
    return writeUniversal(pathname, config);
  }
}

export const configWriter = new ConfigWriter();
