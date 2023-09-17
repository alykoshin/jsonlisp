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

export async function read_config(config_file: string): Promise<FullConfig> {
  if (CONFIG_MODE === '.ts') {
    const module = await import(buildPathname(config_file));
    return module.default;
  } else {
    const content = await fs.readFile(config_file, {encoding: 'utf8'});
    return CONFIG_MODE === '.json5' ? json5.parse(content) : JSON.parse(content);
  }
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



