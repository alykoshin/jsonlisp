"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
const string_1 = __importDefault(require("@utilities/string"));
const object_1 = require("@utilities/object");
const log_1 = require("./log");
const actions_1 = require("../actions/");
const atomDefinitionTypes = [
    'undefined',
    'boolean',
    'number',
    'bigint',
    'string',
    'symbol',
    'object',
];
const isAtom = (value) => 
// atomDefinitionTypes.indexOf(typeof value) >= 0 ||
// value === null
!Array.isArray(value);
const isList = (value) => Array.isArray(value);
// const DEFAULT_DEBUG =
//   false;
// // true;
const DEFAULT_MAX_STEPS = 1000;
const DEFAULT_MAX_LEVELS = 100;
/*
export type TokenEvaluateFn = (this: JsonScript, args: TokenEvaluateFnArgs) => TokenEvaluateFnRes

interface GenericScriptOptions {
  beforeEach?: TokenEvaluateFn
  afterEach?: TokenEvaluateFn
}

class GenericScript {
  beforeEach: TokenEvaluateFn
  afterEach: TokenEvaluateFn

  constructor(
  // actions: ActivityDefinition,
options: GenericScriptOptions = {}) {

  const {beforeEach, afterEach, maxSteps, maxLevels} = options;

  this.beforeEach = beforeEach;
  this.afterEach = afterEach;

  this.maxSteps = (typeof maxSteps !== 'undefined') ? maxSteps : DEFAULT_MAX_STEPS;
  this.maxLevels = (typeof maxLevels !== 'undefined') ? maxLevels : DEFAULT_MAX_LEVELS;
  this._steps = 0; // counter to prevent infinite loops
  this._level = 0; // counter to prevent stack overflow

  //this.TOKEN_BASE_TYPES = {};
  this.tokens = new TokenStorage();
}

}
*/
class Runner {
    maxLevels;
    maxSteps;
    scopes;
    actions;
    actionCount = 0;
    constructor(options = {}) {
        this.maxSteps =
            typeof options.maxSteps !== 'undefined'
                ? options.maxSteps
                : DEFAULT_MAX_STEPS;
        this.maxLevels =
            typeof options.maxLevels !== 'undefined'
                ? options.maxLevels
                : DEFAULT_MAX_LEVELS;
        this.scopes = new object_1.Scopes();
        this.actions = actions_1.actions;
    }
    getActionImplementation(actionDefinition) {
        //     const name = Array.isArray(actionDefinition)
        //       ? actionDefinition[0]
        //       : actionDefinition.action;
        let name, executor, parameters;
        if (typeof actionDefinition === 'function') {
            executor = actionDefinition;
            name = actionDefinition.name;
            parameters = [];
        }
        else if (typeof actionDefinition === 'string') {
            name = actionDefinition;
            executor = this.actions[name];
            parameters = [];
        }
        else {
            [name, ...parameters] = actionDefinition;
            // console.log('>>>', actionDefinition)
            executor = this.actions[name];
        }
        if (!executor) {
            throw new Error(`Unknown action name: "${name}", definition: "${JSON.stringify(actionDefinition)}"`);
        }
        return { name, executor, parameters };
    }
    // _getConfigAction(fullConfig: FullConfig, name: keyof FullConfig['actions'] /*string*/ = 'default'): ActionDefinition {
    //   // const startName: keyof FullConfig['actions'] = 'default';
    //   // this.level = 0;
    //   const action = this.actions[name];
    //   if (!action) throw new Error(`Action "${name}" not found`);
    //   return action;
    // }
    // async _start(filename: string, startName?: keyof FullConfig['actions'] /*string*/ /*= 'default'*/) {
    //   this.actionCount = 0;
    //   const id = this.actionCount++;
    //   const level = 0;
    //
    //   this.log({id,level}, `Using config file "${filename}"`);
    //   const fullConfig = await read_config(filename);
    //
    //   // const startName: keyof FullConfig['actions'] = 'default';
    //   const actionDefinition = this._getConfigAction(fullConfig, startName);
    //   // this.level = 0;
    //   const result = await this.eval(actionDefinition, fullConfig, {level});
    //
    //   this.debug({id,level}, `Exited with result ${JSON.stringify(result)}`)
    // }
    async start(
    // filename: string,
    // startName: keyof typeof actions | keyof FullConfig['actions'], /*string*/ /*= 'default'*/
    // startName: string = 'default',
    { activity, action, scope, }) {
        // const id = this.actionCount++;
        // const level = 0;
        const state = this._initState();
        const logger = new log_1.Logger({
            level: state.level,
            id: this.actionCount,
        });
        logger.warn(`need to clean up the scopes on start`);
        this.scopes.push(scope);
        // logger.debug(`Using config file "${activity}"`);
        // const fullConfig = await read_config(activity);
        this.actions = {
            ...this.actions,
            ...activity.actions,
        };
        // const actionDefinition = this._getConfigAction(activity, action);
        logger.debug(`Starting action "${action}"`);
        // const actionDefinition = this.getActionImplementation(action);
        // logger.debug(`Eval "${JSON.stringify(actionDefinition)}"`);
        const a = Array.isArray(action) ? action : [action];
        const result = await this.eval(a, {
            activity,
            level: state.level,
            logger,
        });
        logger.debug(`Exited with result ${JSON.stringify(result)}`);
    }
    // async exec(parameter: Parameter, fullConfig: FullConfig, {level, logger}: {
    //   level: number,
    //   logger: Logger<LogPrefix>
    // }): Promise<Parameter> {
    //   // const actionDefinition = this._getConfigAction(activity, action);
    //   const actionDefinition = this.getActionImplementation(action);
    //   const result = await this.eval(actionDefinition, activity, {level: state.level, logger});
    //   return result;
    // }
    async eval(parameter, { level, activity, logger, }) {
        // const id = this.actionCount++;
        const id = this._incSteps();
        if (!logger)
            logger = new log_1.Logger({ id, level });
        if (isAtom(parameter)) {
            logger.debug(`eval atom (${typeof parameter}) "${String(parameter)}"`);
            if (typeof parameter === 'string') {
                parameter = string_1.default.literalTemplate(parameter, 
                // ! This is not effective
                this.scopes.merged()._scope);
            }
            return parameter;
        }
        else {
            const { name, executor, parameters } = this.getActionImplementation(parameter);
            const execActionImpl = async () => {
                const newLevel = level + 1;
                const newLogger = logger.new({ id, level: newLevel, name });
                const evState = { activity, level: newLevel, logger: newLogger };
                const evaluate = async (p) => await this.eval(p, evState);
                if (typeof executor === 'function') {
                    logger.debug(`eval function "${name}"`);
                    const exState = {
                        ...evState,
                        name,
                        // parameters,
                        evaluate,
                        // activity,
                        id,
                        // level: newLevel,
                        scopes: this.scopes,
                        runner: this,
                        // logger: newLogger,
                    };
                    return await executor(name, parameters, exState);
                    //
                }
                else if (isList(executor)) {
                    logger.debug(`eval list "${name}"`);
                    return await this.eval(executor, evState);
                    //
                    // } else if (typeof executor === 'string') {
                    //   logger.debug(`eval string "${executor}"`);
                    //   const {
                    //     name,
                    //     executor: newExecutor,
                    //     parameters,
                    //   } = this.getActionImplementation(executor);
                    //   return await execActionImpl();
                    //   //
                }
                else {
                    throw new Error(`Unknown method at eval(): ${name} => ${JSON.stringify(executor)}`);
                    //
                }
            };
            return await execActionImpl();
        }
    }
    //
    _incLevel(state) {
        if (++state.level > this.maxLevels)
            throw new Error(`JsonScript: Script stack overflow. Script went deeper than ${this.maxLevels} levels. You can increase this value by setting maxLevels value in options.`);
    }
    _decLevel(state) {
        if (--state.level < 0)
            throw new Error(`JsonScript: Script stack underflow.`);
    }
    _incSteps() {
        if (++this.actionCount > this.maxSteps)
            throw new Error(`JsonScript: Script was run for more than ${this.maxSteps} steps. You can increase this value by setting maxSteps value in options.`);
        return this.actionCount;
    }
    _resetState(state) {
        this.actionCount = 0;
        state.level = 0;
    }
    _initState() {
        this.actionCount = 0;
        return {
            level: 0,
        };
    }
}
exports.Runner = Runner;
//# sourceMappingURL=runner.js.map