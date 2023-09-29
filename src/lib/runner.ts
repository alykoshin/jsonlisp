/** @format */

import stringUtils from '@utilities/string'
import {ScopeObject, Scopes} from '@utilities/object'
import {Logger, LogPrefix} from './log'
import {Activity} from './config'
import {actions} from '../actions/'

export interface ActionMethodState {
  name: string
  // parameters: Parameters;
  evaluate: (parameter: Parameter) => Promise<Parameter>
  id: number | string
  level: number
  // activity: Activity
  scopes: Scopes<AtomDefinition>
  runner: Runner
  logger: Logger<LogPrefix>
}

export type ActionListExecutor = (
  name: string,
  parameters: Parameters,
  state: ActionMethodState
) => Promise<any>

export type AtomDefinition =
  | undefined
  | boolean
  | number
  | bigint
  | string
  // | symbol
  | null
  | object

const atomDefinitionTypes = [
  'undefined',
  'boolean',
  'number',
  'bigint',
  'string',
  'symbol',
  'object',
] as const

const isAtom = (value: any): value is AtomDefinition =>
  // atomDefinitionTypes.indexOf(typeof value) >= 0 ||
  // value === null
  !Array.isArray(value)

//

export type Parameter = AtomDefinition | ActionListDefinition
export type Parameters = Parameter[]

export type ActionName = string

//

export type ListDefinition = [...parameters: Parameter[]]

const isList = (value: any[]): value is ListDefinition => Array.isArray(value)

export type ActionListDefinition = [
  name: ActionName,
  ...parameters: Parameter[]
]

//

export type ActionDefinition =
  | ActionName
  | ActionListExecutor
  | ActionListDefinition

export type Actions = {
  [name: string]: ActionDefinition
}

// const DEFAULT_DEBUG =
//   false;
// // true;
const DEFAULT_MAX_STEPS = 1000
const DEFAULT_MAX_LEVELS = 100

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

type ActionArg = string
type ActionWithParamsArg = string[]

export class Runner {
  maxLevels: number
  maxSteps: number
  scopes: Scopes<AtomDefinition>
  actions: Actions
  actionCount: number = 0

  constructor(options: {maxLevels?: number; maxSteps?: number} = {}) {
    this.maxSteps =
      typeof options.maxSteps !== 'undefined'
        ? options.maxSteps
        : DEFAULT_MAX_STEPS
    this.maxLevels =
      typeof options.maxLevels !== 'undefined'
        ? options.maxLevels
        : DEFAULT_MAX_LEVELS
    this.scopes = new Scopes<AtomDefinition>()
    this.actions = actions
  }

  getActionImplementation(
    actionDefinition: ActionDefinition,
    logger: Logger<LogPrefix>
  ): {
    name: ActionName
    executor: ActionListExecutor
    params: Parameter[]
  } {
    //     const name = Array.isArray(actionDefinition)
    //       ? actionDefinition[0]
    //       : actionDefinition.action;
    let name, executor, parameters
    if (typeof actionDefinition === 'function') {
      executor = actionDefinition
      name = actionDefinition.name
      parameters = <Parameter[]>[]
    } else if (typeof actionDefinition === 'string') {
      name = actionDefinition
      executor = <ActionListExecutor>this.actions[name]
      parameters = <Parameter[]>[]
    } else {
      if (!isList(actionDefinition)) {
        let msg = [
          `Expect list (i.e.array), instead found:`,
          typeof actionDefinition,
          JSON.stringify(actionDefinition),
        ]
        logger.fatal(...msg)
      }

      ;[name, ...parameters] = actionDefinition
      if (typeof name !== 'string') {
        let msg = [
          `Expect symbol (i.e.string), instead found:`,
          isList(name) ? `list (i.e.array)` : `"${typeof name}`,
          JSON.stringify(name),
          `, definition:`,
          JSON.stringify(actionDefinition),
        ]
        logger.fatal(...msg)
      }
      // console.log('>>>', actionDefinition)
      executor = <ActionListExecutor>this.actions[name]
    }
    if (!executor) {
      let msg = [
        `Unknown action name: "${name}"`,
        `, definition: "${JSON.stringify(actionDefinition)}"`,
      ]
      logger.fatal(...msg)
    }
    return {name, executor, params: parameters}
  }

  async start({
    activity,
    action,
    scope,
  }: {
    activity: Activity | undefined
    action: ActionArg | ActionWithParamsArg
    scope: ScopeObject<AtomDefinition>
  }) {
    // const id = this.actionCount++;
    // const level = 0;
    const state = this._initState()
    const logger = new Logger<LogPrefix>({
      level: state.level,
      id: this.actionCount,
    })

    logger.warn(`need to clean up the scopes on start`)
    this.scopes.push(scope)

    // logger.debug(`Using config file "${activity}"`);
    // const fullConfig = await read_config(activity);

    if (activity) {
      this.actions = {
        ...this.actions,
        ...activity.actions,
      }
    }

    // const actionDefinition = this._getConfigAction(activity, action);
    logger.debug(`Starting action "${action}"`)
    // const actionDefinition = this.getActionImplementation(action);

    // logger.debug(`Eval "${JSON.stringify(actionDefinition)}"`);
    const a = Array.isArray(action) ? action : [action]
    const result = await this.eval(a, {
      // activity,
      level: state.level,
      logger,
    })

    logger.debug(`Exited with result ${JSON.stringify(result)}`)
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

  async eval(
    param: Parameter,
    {
      level,
      // activity,
      logger,
    }: {
      // activity: Activity
      level: number
      logger: Logger<LogPrefix>
    }
  ): Promise<Parameter> {
    // const id = this.actionCount++;
    const id = this._incSteps()

    if (!logger) logger = new Logger({id, level})
    // logger.debug(`eval: parameter:`, parameter);

    if (isAtom(param)) {
      logger.debug(`eval atom (${typeof param}) "${String(param)}"`)

      if (typeof param === 'string') {
        param = stringUtils.literalTemplate(
          param,
          // ! This is not effective
          this.scopes.merged()._scope
        )
      }

      return param
    } else {
      // logger.debug(`eval: parameter:`, param);
      const {name, executor, params} = this.getActionImplementation(
        param,
        logger
      )
      // logger.debug(`eval: executor:`, executor);
      // logger.debug(`eval: parameters:`, params);

      const execActionImpl = async (): Promise<Parameter> => {
        const newLevel = level + 1
        const newName = logger._prefix.name
          ? logger._prefix.name + '/' + name
          : name
        const newLogger = logger.new({
          id,
          level: newLevel,
          name: newName,
        })

        const evState = {
          // activity,
          level: newLevel,
          logger: newLogger,
        }
        const evaluate = async (p: Parameter) => await this.eval(p, evState)

        if (typeof executor === 'function') {
          logger.debug(`eval function "${name}"`)
          const exState: ActionMethodState = {
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
          }
          return await executor(name, params, exState)
          //
        } else if (isList(executor)) {
          logger.debug(`eval list "${name}"`)
          // logger.debug(`eval list "${name}": executor:`, executor);
          return await this.eval(executor, evState)
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
        } else {
          throw new Error(
            `Unknown method at eval(): ${name} => ${JSON.stringify(executor)}`
          )
          //
        }
      }
      return await execActionImpl()
    }
  }

  //

  _incLevel(state: {level: number}) {
    if (++state.level > this.maxLevels)
      throw new Error(
        `JsonScript: Script stack overflow. Script went deeper than ${this.maxLevels} levels. You can increase this value by setting maxLevels value in options.`
      )
  }

  _decLevel(state: {level: number}) {
    if (--state.level < 0)
      throw new Error(`JsonScript: Script stack underflow.`)
  }

  _incSteps() {
    if (++this.actionCount > this.maxSteps)
      throw new Error(
        `JsonScript: Script was run for more than ${this.maxSteps} steps. You can increase this value by setting maxSteps value in options.`
      )
    return this.actionCount
  }

  _resetState(state: {level: number}): void {
    this.actionCount = 0
    state.level = 0
  }

  _initState(): {level: number} {
    this.actionCount = 0
    return {
      level: 0,
    }
  }

  //
}
