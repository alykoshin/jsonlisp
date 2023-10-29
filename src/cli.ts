/** @format */

// #!/usr/bin/env ts-node

import * as _ from 'lodash';
import JSON5 from 'json5';
import {Command} from 'commander';

// import pkg from '../package.json';
import {Runner} from './apps/runner/runner';
import {Activities} from './apps/runner/startup/Activities';

import '../_settings'; // init config and dotenv
import {PROJECT_DIR, packageJson as pkg} from '../_settings';
import {absPathname} from './lib/fileUtils/fileUtils';
import {
  readUniversal,
  resolveToFile,
} from './lib/fileUtils/read-write/universalFileUtils';

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

function parseDataArg(options: {dataJson?: string; dataJson5?: string}): any {
  const cmdlineData = options.dataJson
    ? JSON.parse(options.dataJson)
    : options.dataJson5
    ? JSON5.parse(options.dataJson5)
    : {};
  // console.log(`cmdlineData: "${JSON.stringify(cmdlineData)}"`);
  return cmdlineData;
}

async function prepareAction({
  activity,
  action,
  parameters,
  dataFile,
  dataJson,
  dataJson5,
}: {
  activity: string;
  action: string;
  parameters: string[];
  dataFile?: string;
  dataJson?: string;
  dataJson5?: string;
}): Promise<{activities: Activities; args: string[]; data: any}> {
  const args = [action, ...parameters];

  // console.log(`activity:`, activity);
  const activities = new Activities();
  if (activity) await activities.plug(activity);
  // console.log(`activities:`, activities);

  // console.log(`dataFile:`, dataFile);
  const fileData = await loadDataFile(dataFile);

  const cmdlineData = parseDataArg({dataJson, dataJson5});

  const data = _.defaultsDeep({}, fileData, cmdlineData); //, {test: 'test-value'}),
  // console.log(`data: "${JSON.stringify(data)}"`);

  return {activities, args, data};
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
    '-j, --data-json <json>',
    'Optional data (stringified JSON) to pass to the action (deeply overrides --data-file)'
  )
  .option(
    '-5, --data-json5 <json5>',
    'Optional data (stringified JSON5) to pass to the action (deeply overrides --data-file)'
  )
  .action(
    async (
      activity: string,
      action: string,
      params: string[],
      options: {dataFile?: string; dataJson?: string; dataJson5?: string}
    ) => {
      if (options.dataJson && options.dataJson5) {
        const msg = `Options --data-json and --data-json5 are mutually exclusive`;
        throw new Error(msg);
      }
      console.log(
        `Starting ` +
          `activity: "${activity}", ` +
          `action: "${action}", ` +
          `params: ${JSON.stringify(params)}, ` +
          `options: ${JSON.stringify(options)}`
      );
      const {activities, args, data} = await prepareAction({
        activity,
        action,
        parameters: params,
        ...options,
      });

      const runner = new Runner();
      const st = await runner.init({
        activities,
        scope: data,
      });
      await runner.start(args, st);
    }
  )
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
