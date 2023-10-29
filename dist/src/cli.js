"use strict";
/** @format */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// #!/usr/bin/env ts-node
const _ = __importStar(require("lodash"));
const json5_1 = __importDefault(require("json5"));
const commander_1 = require("commander");
// import pkg from '../package.json';
const runner_1 = require("./apps/runner/runner");
const Activities_1 = require("./apps/runner/startup/Activities");
require("../_settings"); // init config and dotenv
const _settings_1 = require("../_settings");
const fileUtils_1 = require("./lib/fileUtils/fileUtils");
const universalFileUtils_1 = require("./lib/fileUtils/read-write/universalFileUtils");
async function loadDataFile(filename) {
    let fileData = {};
    if (filename) {
        filename = (0, fileUtils_1.absPathname)(filename);
        filename = (0, universalFileUtils_1.resolveToFile)(filename);
        fileData = await (0, universalFileUtils_1.readUniversal)(filename);
    }
    // console.log(`fileData: "${JSON.stringify(fileData)}"`);
    return fileData;
}
// type DataJsonType = 'json' | 'json5';
function parseDataArg(options) {
    const cmdlineData = options.dataJson
        ? JSON.parse(options.dataJson)
        : options.dataJson5
            ? json5_1.default.parse(options.dataJson5)
            : {};
    // console.log(`cmdlineData: "${JSON.stringify(cmdlineData)}"`);
    return cmdlineData;
}
async function prepareAction({ activity, action, parameters, dataFile, dataJson, dataJson5, }) {
    const args = [action, ...parameters];
    // console.log(`activity:`, activity);
    const activities = new Activities_1.Activities();
    if (activity)
        await activities.plug(activity);
    // console.log(`activities:`, activities);
    // console.log(`dataFile:`, dataFile);
    const fileData = await loadDataFile(dataFile);
    const cmdlineData = parseDataArg({ dataJson, dataJson5 });
    const data = _.defaultsDeep({}, fileData, cmdlineData); //, {test: 'test-value'}),
    // console.log(`data: "${JSON.stringify(data)}"`);
    return { activities, args, data };
}
const program = new commander_1.Command();
program
    .name(_settings_1.packageJson.name)
    .description(_settings_1.packageJson.description)
    .version(_settings_1.packageJson.version)
    .argument('<activity>', 'Activity filename to load')
    .argument('[action]', "Activity' action name to run", 'default')
    .argument('[parameters...]', 'Parameters to pass to the action', [])
    .option('-f, --data-file <filename>', 'Optional file with data object to pass to the action; supported types: .ts, .js, .json .json5')
    .option('-j, --data-json <json>', 'Optional data (stringified JSON) to pass to the action (deeply overrides --data-file)')
    .option('-5, --data-json5 <json5>', 'Optional data (stringified JSON5) to pass to the action (deeply overrides --data-file)')
    .action(async (activity, action, params, options) => {
    if (options.dataJson && options.dataJson5) {
        const msg = `Options --data-json and --data-json5 are mutually exclusive`;
        throw new Error(msg);
    }
    console.log(`Starting ` +
        `activity: "${activity}", ` +
        `action: "${action}", ` +
        `params: ${JSON.stringify(params)}, ` +
        `options: ${JSON.stringify(options)}`);
    const { activities, args, data } = await prepareAction({
        activity,
        action,
        parameters: params,
        ...options,
    });
    const runner = new runner_1.Runner();
    const st = await runner.init({
        activities,
        scope: data,
    });
    await runner.start(args, st);
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
`);
program.parse();
/*
async function start() {
  const pathname = getConfigFilename();
  const runner = new Runner()
  await runner.start(pathname, { scope: { test: 'test-value'} })
}
start();
*/
//# sourceMappingURL=cli.js.map