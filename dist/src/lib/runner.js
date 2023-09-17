"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
const string_1 = __importDefault(require("@utilities/string"));
const object_1 = require("@utilities/object");
const log_1 = require("./log");
const config_1 = require("./config");
const actions_1 = require("../actions/");
const atomDefinitionTypes = ['undefined', 'boolean', 'number', 'bigint', 'string', 'symbol', 'object'];
const isAtom = (value) => (
// atomDefinitionTypes.indexOf(typeof value) >= 0 ||
// value === null
!Array.isArray(value));
const isList = (value) => (Array.isArray(value));
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
    maxLevels = DEFAULT_MAX_LEVELS;
    maxSteps = DEFAULT_MAX_STEPS;
    scopes;
    actions;
    actionCount = 0;
    constructor(options = {}) {
        this.maxSteps = (typeof options.maxSteps !== 'undefined') ? options.maxSteps : DEFAULT_MAX_STEPS;
        this.maxLevels = (typeof options.maxLevels !== 'undefined') ? options.maxLevels : DEFAULT_MAX_LEVELS;
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
            throw new Error(`Unknown action at action definition "${JSON.stringify(actionDefinition)}"`);
        }
        return { name, executor, parameters };
    }
    _getConfigAction(fullConfig, name = 'default') {
        // const startName: keyof FullConfig['actions'] = 'default';
        // this.level = 0;
        return this.actions[name];
    }
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
        const logger = new log_1.Logger({ level: state.level, id: this.actionCount });
        logger.warn(`need to clean up the scopes on start`);
        this.scopes.push(scope);
        logger.debug(`Using config file "${activity}"`);
        const fullConfig = await (0, config_1.read_config)(activity);
        this.actions = {
            ...this.actions,
            ...fullConfig.actions,
        };
        const actionDefinition = this._getConfigAction(fullConfig, action);
        const result = await this.eval(actionDefinition, fullConfig, { level: state.level, logger });
        logger.debug(`Exited with result ${JSON.stringify(result)}`);
    }
    async eval(parameter, fullConfig, { level, logger }) {
        // const id = this.actionCount++;
        const id = this._incSteps();
        if (!logger)
            logger = new log_1.Logger({ id, level });
        if (isAtom(parameter)) {
            logger.debug(`eval atom "${String(parameter)}" (typeof="${typeof parameter}")`);
            if (typeof parameter === 'string') {
                parameter = string_1.default.literalTemplate(parameter, 
                // ! This is not effective
                this.scopes.merged()._scope);
            }
            return parameter;
        }
        else {
            const { name, executor, parameters } = this.getActionImplementation(parameter);
            const newLevel = level + 1;
            const newLogger = logger.new({ id, level: newLevel });
            if (typeof executor === 'function') {
                logger.debug(`eval function "${name}"`);
                return await executor(name, parameters, { id, level: newLevel, fullConfig, runner: this, logger: newLogger });
            }
            else if (isList(executor)) {
                logger.debug(`eval list "${name}"`);
                return await this.eval(executor, fullConfig, { level: newLevel, logger: newLogger });
            }
            else {
                throw new Error(`Unknown method at eval(): ${name} => ${JSON.stringify(executor)}`);
            }
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