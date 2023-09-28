"use strict";
/** @format */
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
    getActionImplementation(actionDefinition, logger) {
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
            if (!isList(actionDefinition)) {
                let msg = [
                    `Expect list (i.e.array), instead found:`,
                    typeof actionDefinition,
                    JSON.stringify(actionDefinition),
                ];
                logger.fatal(...msg);
            }
            [name, ...parameters] = actionDefinition;
            if (typeof name !== 'string') {
                let msg = [
                    `Expect symbol (i.e.string), instead found:`,
                    isList(name) ? `list (i.e.array)` : `"${typeof name}`,
                    JSON.stringify(name),
                    `, definition:`,
                    JSON.stringify(actionDefinition),
                ];
                logger.fatal(...msg);
            }
            // console.log('>>>', actionDefinition)
            executor = this.actions[name];
        }
        if (!executor) {
            let msg = [
                `Unknown action name: "${name}"`,
                `, definition: "${JSON.stringify(actionDefinition)}"`,
            ];
            logger.fatal(...msg);
        }
        return { name, executor, params: parameters };
    }
    async start({ activity, action, scope, }) {
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
    async eval(param, { level, activity, logger, }) {
        // const id = this.actionCount++;
        const id = this._incSteps();
        if (!logger)
            logger = new log_1.Logger({ id, level });
        // logger.debug(`eval: parameter:`, parameter);
        if (isAtom(param)) {
            logger.debug(`eval atom (${typeof param}) "${String(param)}"`);
            if (typeof param === 'string') {
                param = string_1.default.literalTemplate(param, 
                // ! This is not effective
                this.scopes.merged()._scope);
            }
            return param;
        }
        else {
            // logger.debug(`eval: parameter:`, param);
            const { name, executor, params } = this.getActionImplementation(param, logger);
            // logger.debug(`eval: executor:`, executor);
            // logger.debug(`eval: parameters:`, params);
            const execActionImpl = async () => {
                const newLevel = level + 1;
                const newName = logger._prefix.name
                    ? logger._prefix.name + '/' + name
                    : name;
                const newLogger = logger.new({
                    id,
                    level: newLevel,
                    name: newName,
                });
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
                    return await executor(name, params, exState);
                    //
                }
                else if (isList(executor)) {
                    logger.debug(`eval list "${name}"`);
                    // logger.debug(`eval list "${name}": executor:`, executor);
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