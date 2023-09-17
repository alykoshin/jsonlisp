import stringUtils from "@utilities/string";
import {ScopeObject, Scopes} from "@utilities/object";
import {Logger, LogPrefix} from './log'
import {FullConfig, read_config} from './config'
import {actions} from '../actions/'

export interface ActionMethodState {
  id: number | string,
  level: number,
  fullConfig: FullConfig,
  runner: Runner
  logger: Logger<LogPrefix>
}

export type ActionListExecutor = (
  name: string,
  parameters: Parameters,
  state: ActionMethodState
) => Promise<any>

export type AtomDefinition = undefined | boolean | number | bigint | string | symbol | null | object;

const atomDefinitionTypes = ['undefined', 'boolean', 'number', 'bigint', 'string', 'symbol', 'object']

const isAtom = (value: any): value is AtomDefinition => (
  // atomDefinitionTypes.indexOf(typeof value) >= 0 ||
  // value === null
  !Array.isArray(value)
);

//

export type Parameter = AtomDefinition | ActionListDefinition
export type Parameters = Parameter[]

export type ActionName = string;

//

export type ListDefinition = [
  ...parameters: Parameter[],
]

const isList = (value: any[]): value is ListDefinition => (
  Array.isArray(value)
);

export type ActionListDefinition = [
  name: ActionName,
  ...parameters: Parameter[],
]

//

export type ActionDefinition = ActionName | ActionListExecutor | ActionListDefinition

export type Actions = {
  [name: string]: ActionDefinition
}

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


export class Runner {
  maxLevels: number = DEFAULT_MAX_LEVELS
  maxSteps: number = DEFAULT_MAX_STEPS
  scopes: Scopes<AtomDefinition>;
  actions: Actions;
  actionCount: number = 0;

  constructor(options: { maxLevels?: number, maxSteps?: number } = {}) {
    this.maxSteps = (typeof options.maxSteps !== 'undefined') ? options.maxSteps : DEFAULT_MAX_STEPS;
    this.maxLevels = (typeof options.maxLevels !== 'undefined') ? options.maxLevels : DEFAULT_MAX_LEVELS;
    this.scopes = new Scopes<AtomDefinition>();
    this.actions = actions;
  }

  getActionImplementation(actionDefinition: ActionDefinition): {
    name: ActionName,
    executor: ActionListExecutor,
    parameters: Parameter[]
  } {
//     const name = Array.isArray(actionDefinition)
//       ? actionDefinition[0]
//       : actionDefinition.action;
    let name, executor, parameters;
    if (typeof actionDefinition === 'function') {
      executor = actionDefinition
      name = actionDefinition.name;
      parameters = <Parameter[]>[];

    } else if (typeof actionDefinition === 'string') {
      name = actionDefinition;
      executor = <ActionListExecutor>this.actions[name]
      parameters = <Parameter[]>[];

    } else {
      [name, ...parameters] = actionDefinition;
      // console.log('>>>', actionDefinition)
      executor = <ActionListExecutor>this.actions[name]
    }
    if (!executor) {
      throw new Error(`Unknown action at action definition "${JSON.stringify(actionDefinition)}"`);
    }
    return {name, executor, parameters}
  }

  _getConfigAction(fullConfig: FullConfig, name: keyof FullConfig['actions'] /*string*/ = 'default'): ActionDefinition {
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
    {
      activity,
      action,
      scope,
    }: {
      activity: string,
      action: keyof typeof actions | keyof FullConfig['actions'], /*string*/ /*= 'default'*/
      scope: ScopeObject<AtomDefinition>
    },
  ) {
    // const id = this.actionCount++;
    // const level = 0;
    const state = this._initState();
    const logger = new Logger<LogPrefix>({level: state.level, id: this.actionCount});

    logger.warn(`need to clean up the scopes on start`);
    this.scopes.push(scope);

    logger.debug(`Using config file "${activity}"`);
    const fullConfig = await read_config(activity);

    this.actions = {
      ...this.actions,
      ...fullConfig.actions,
    }

    const actionDefinition = this._getConfigAction(fullConfig, action);
    const result = await this.eval(actionDefinition, fullConfig, {level: state.level, logger});

    logger.debug(`Exited with result ${JSON.stringify(result)}`)
  }

  async eval(parameter: Parameter, fullConfig: FullConfig, {level, logger}: {
    level: number,
    logger: Logger<LogPrefix>
  }): Promise<Parameter> {
    // const id = this.actionCount++;
    const id = this._incSteps();

    if (!logger) logger = new Logger({id, level});

    if (isAtom(parameter)) {
      logger.debug(`eval atom "${String(parameter)}" (typeof="${typeof parameter}")`);

      if (typeof parameter === 'string') {
        parameter = stringUtils.literalTemplate(parameter,
          // ! This is not effective
          this.scopes.merged()._scope
        );
      }

      return parameter;

    } else {
      const {name, executor, parameters} = this.getActionImplementation(parameter);
      const newLevel = level + 1;
      const newLogger = logger.new({id, level: newLevel});

      if (typeof executor === 'function') {
        logger.debug(`eval function "${name}"`);
        return await executor(name, parameters, {id, level: newLevel, fullConfig, runner: this, logger: newLogger});

      } else if (isList(executor)) {
        logger.debug(`eval list "${name}"`);
        return await this.eval(executor, fullConfig, {level: newLevel, logger: newLogger});

      } else {
        throw new Error(`Unknown method at eval(): ${name} => ${JSON.stringify(executor)}`);
      }

    }
  }

  //

  _incLevel(state: { level: number }) {
    if (++state.level > this.maxLevels) throw new Error(`JsonScript: Script stack overflow. Script went deeper than ${this.maxLevels} levels. You can increase this value by setting maxLevels value in options.`);
  }

  _decLevel(state: { level: number }) {
    if (--state.level < 0) throw new Error(`JsonScript: Script stack underflow.`);
  }

  _incSteps() {
    if (++this.actionCount > this.maxSteps) throw new Error(`JsonScript: Script was run for more than ${this.maxSteps} steps. You can increase this value by setting maxSteps value in options.`);
    return this.actionCount;
  }

  _resetState(state: { level: number }): void {
    this.actionCount = 0
    state.level = 0;
  }

  _initState(): { level: number } {
    this.actionCount = 0
    return {
      level: 0,
    };
  }


  //
}
