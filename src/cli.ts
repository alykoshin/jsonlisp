// #!/usr/bin/env ts-node

import * as path from 'path';
import * as _ from 'lodash';
import {Command} from 'commander';
import pkg from '../package.json';
import fs from "fs/promises";
import json5 from "json5";
import {Runner} from "./lib/runner";
import {readToolsFile} from "./lib/config";

const program = new Command();

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version)
  .argument('<activity>', 'Activity filename to load')
  .argument('[action]', 'Activity\' action name to run', 'default')
  .option('-f, --data-file <filename>', 'Optional file with data object to pass to the action; supported types: .ts, .js, .json .json5')
  .option('-j, --data-json <json>', 'Optional data (stringified JSON) to pass to the action (deeply overrides --data-file)')
  .option('-5, --data-json5 <json5>', 'Optional data (stringified JSON5) to pass to the action (deeply overrides --data-file)')
  .action(async (activity, action, options, command) => {
    console.log(`Starting activity: "${activity}" action: "${action}"`)

    console.warn(`WARN: dataFile is not implemented`)

    if (options.dataFile) {

      const data = readToolsFile(options.dataFile)


    }
    if (options.dataJson && options.dataJson5) throw new Error(`Options --data-json and --data-json5 are mutually exclusive`)
    const data = options.dataJson ? JSON.parse(options.dataJson) : options.dataJson ? JSON.parse(options.dataJson5) : {};
    const runner = new Runner()
    await runner.start({
      activity,
      action,
      scope: data,//{test: 'test-value'}
    });
  })
  .addHelpText('after', `
    Example calls (Windows):
      > ts-node .\\src\\cli.ts .\\tools-runner.ts default ttt --data-json '{ "test": "test-value" }'    
      > ts-node .\\src\\cli.ts .\\tools-runner.ts default ttt --data-json '{ """test""": """test-value""" }'    
      > ts-node .\\src\\cli.ts .\\tools-runner.ts default ttt --data-json '{ ^"test^": ^"test-value^" }'    
      > ts-node .\\src\\cli.ts .\\tools-runner.ts default ttt --data-json5 "{ test: 'test-value' }"    
      > yarn run start -- tools-runner.ts default ttt '{"test": "test-value"}'
    Example calls (Linux):
      $ yarn run start -- tools-runner.ts default ttt '{"test": "test-value"}'
 `)

;

program.parse();

/*
async function start() {
  const pathname = getConfigFilename();
  const runner = new Runner()
  await runner.start(pathname, { scope: { test: 'test-value'} })
}
start();
*/


