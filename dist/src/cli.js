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
const _ = __importStar(require("lodash"));
const commander_1 = require("commander");
const package_json_1 = __importDefault(require("../package.json"));
const runner_1 = require("./lib/runner");
const config_1 = require("./lib/config");
const program = new commander_1.Command();
program
    .name(package_json_1.default.name)
    .description(package_json_1.default.description)
    .version(package_json_1.default.version)
    .argument('<activity>', 'Activity filename to load')
    .argument('[action]', "Activity' action name to run", 'default')
    .argument('[parameters...]', 'Parameters to pass to the action', [])
    .option('-f, --data-file <filename>', 'Optional file with data object to pass to the action; supported types: .ts, .js, .json .json5')
    .option('-j, --data-json <json>', 'Optional data (stringified JSON) to pass to the action (deeply overrides --data-file)')
    .option('-5, --data-json5 <json5>', 'Optional data (stringified JSON5) to pass to the action (deeply overrides --data-file)')
    .action(async (activityName, actionName, parameters, options) => {
    console.log(`Starting ` +
        `activity: "${activityName}", ` +
        `action: "${actionName}", ` +
        `parameters: ${JSON.stringify(parameters)}, ` +
        `options: ${JSON.stringify(options)}`);
    const activityData = activityName
        ? await (0, config_1.readActivityFile)(activityName)
        : undefined;
    const fileData = options.dataFile
        ? await config_1.configReader.read(options.dataFile)
        : {};
    console.log(`fileData: "${JSON.stringify(fileData)}"`);
    if (options.dataJson && options.dataJson5) {
        const msg = `Options --data-json and --data-json5 are mutually exclusive`;
        throw new Error(msg);
    }
    const cmdlineData = options.dataJson
        ? JSON.parse(options.dataJson)
        : options.dataJson
            ? JSON.parse(options.dataJson5)
            : {};
    console.log(`cmdlineData: "${JSON.stringify(cmdlineData)}"`);
    const finalData = _.defaultsDeep({}, fileData, cmdlineData); //, {test: 'test-value'}),
    console.log(`finalData: "${JSON.stringify(finalData)}"`);
    const runner = new runner_1.Runner();
    await runner.start({
        activity: activityData,
        action: [actionName, ...parameters],
        scope: finalData,
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