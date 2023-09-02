import fs from "node:fs/promises";
import * as json5 from "json5";
import * as path from "path";

import {ActionConfig} from "../recipes/";
import {log_data} from "./log";

const CONFIG_MODE = 'json5'; // 'json'

export interface FullConfig {
  base_dir: string
  version: string
  execute: ActionConfig
}

export async function read_config(config_file: string): Promise<FullConfig> {
  const content = await fs.readFile(config_file, {encoding: 'utf8'});
  return CONFIG_MODE === 'json5' ? json5.parse(content) : JSON.parse(content);
}

export async function write_config(config_file: string, config: FullConfig) {
  await fs.writeFile(config_file, CONFIG_MODE === 'json5' ? json5.stringify(config, null, 2) : JSON.stringify(config, null, 2));
}

function replace_extname(pathname: string, extname: string) {
  return path.join(path.dirname(pathname), path.basename(pathname, path.extname(pathname)) + extname);
}

export function getConfigFilename(): string {
  // log_data('process.argv:', process.argv)
  let config_file = process.argv[2];
// if (!config_file) throw new Error('config file not specified');
  if (!config_file) {
    const this_file = process.argv[1];
    config_file = replace_extname(this_file, CONFIG_MODE === 'json5' ? '.json5' : '.json');
  }
  log_data(`Using config file "${config_file}"`);
  return config_file;
}

