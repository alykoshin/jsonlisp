#!/usr/bin/env node
/** @format */

import * as _ from 'lodash';
import JSON5 from 'json5';
import {Command} from 'commander';

// import pkg from '../package.json';
import {Runner} from './apps/runner/runner';
import {Activities} from './apps/runner/startup/Activities';

import './_settings'; // init config and dotenv
import {PROJECT_DIR, packageJson as pkg} from './_settings';
import {absPathname} from './lib/fileUtils/fileUtils';
import {
  readUniversal,
  resolveToFile,
} from './lib/fileUtils/read-write/universalFileUtils';
import {DEFAULT_ERROR_LEVEL, ErrorLevel} from './lib/log';

type CliArgsArr = [
  activity: string,
  action: string,
  parameters: string[],
  options: {
    dataFile?: string;
    dataJson?: string;
    dataJson5?: string;
    debug?: boolean;
  },
];
type CliArgsObj = {
  activity: string;
  action: string;
  parameters: string[];
  options: {
    dataFile?: string;
    dataJson?: string;
    dataJson5?: string;
    debug?: boolean;
  };
};

async function loadDataFile(filename?: string): Promise<any> {
  let fileData = {};
  if (filename) {
    filename = absPathname(filename);
    filename = resolveToFile(filename);
    fileData = await readUniversal(filename);
  }
  // console.log(`fileData: "${JSON.stringify(fileData)}"`);
  return fileData;
}

// type DataJsonType = 'json' | 'json5';

// function parseDataArg(options: {dataJson?: string; dataJson5?: string}): any {
//   if (options.dataJson && options.dataJson5) {
//     const msg = `Options --data-json and --data-json5 are mutually exclusive`;
//     throw new Error(msg);
//   }
//   const d = options.dataJson ? JSON.parse(options.dataJson) : {};
//   const d5 = options.dataJson5 ? JSON5.parse(options.dataJson5) : {};
//   return Object.assign({}, d, d5);
// }

async function prepareAction(cliArgs: CliArgsObj): Promise<{
  activities: Activities;
  args: string[];
  data: any;
  logLevel: ErrorLevel;
}> {
  const args = [cliArgs.action, ...cliArgs.parameters];

  // console.log(`activity:`, activity);
  const activities = new Activities();
  if (cliArgs.activity) {
    await activities.plug(cliArgs.activity);
  }
  const logLevel = activities.logLevel();
  // console.log(`activities:`, activities);

  // console.log(`dataFile:`, dataFile);
  const fileData = await loadDataFile(cliArgs.options.dataFile);
  const cmdJson = cliArgs.options.dataJson
    ? JSON.parse(cliArgs.options.dataJson)
    : {};
  const cmdJson5 = cliArgs.options.dataJson5
    ? JSON5.parse(cliArgs.options.dataJson5)
    : {};
  const data = _.defaultsDeep({}, fileData, cmdJson5, cmdJson); //, {test: 'test-value'}),
  // console.log(`data: "${JSON.stringify(data)}"`);

  return {activities, args, data, logLevel};
}

const program = new Command();

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version)
  .argument('<activity>', 'Activity filename to load')
  .argument('[action]', "Activity' action name to run", 'default')
  .argument('[parameters...]', 'Parameters to pass to the action', [])
  .option(
    '-f, --data-file <filename>',
    'Optional file with data object to pass to the action; supported types: .ts, .js, .json .json5'
  )
  .option(
    '-j, --json-data <json-data-as-string>>',
    'Optional data (stringified JSON) to pass to the action from command line (deeply overrides --data-file)'
  )
  .option(
    '-5, --json5-data <json5-data-as-string>>',
    'Optional data (stringified JSON5) to pass to the action from command line  (deeply overrides --data-file)'
  )
  .option('-d, --debug', 'Turn on debug mode')
  .action(async (...origCliArgs: CliArgsArr) => {
    const [activity, action, parameters, options] = origCliArgs;
    const cliArgs = {activity, action, parameters, options};

    console.log(`CLI starts: ${JSON.stringify(cliArgs)}`);
    const {activities, args, data, logLevel} = await prepareAction(cliArgs);
    // console.log('activity:', activity);
    // console.log('activities:', activities);

    const errorLevel = options.debug
      ? 'debug'
      : logLevel
      ? logLevel
      : DEFAULT_ERROR_LEVEL;

    // console.log('activities:', activities);

    const runner = new Runner({errorLevel});
    const st = await runner.init({
      activities,
      scope: data,
    });
    await runner.start(args, st);
  })
  .addHelpText(
    'after',
    `
    Example calls (Windows):
      > ts-node .\\src\\cli.ts .\\tools-runner.ts default ttt --data-json '{ "test": "test-value" }'    
      > ts-node .\\src\\cli.ts .\\tools-runner.ts default ttt --data-json '{ """test""": """test-value""" }'    
      > ts-node .\\src\\cli.ts .\\tools-runner.ts default ttt --data-json '{ ^"test^": ^"test-value^" }'    
      > ts-node .\\src\\cli.ts .\\tools-runner.ts default ttt --data-json5 "{ test: 'test-value' }"    
      > yarn run start -- tools-runner.ts default ttt '{"test": "test-value"}'
    Example calls (Linux):
      $ yarn run start -- tools-runner.ts default ttt '{"test": "test-value"}'
`
  );

program.parse();

/*
async function start() {
  const pathname = getConfigFilename();
  const runner = new Runner()
  await runner.start(pathname, { scope: { test: 'test-value'} })
}
start();
*/
