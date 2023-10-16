/** @format */

import stringUtils from '@utilities/string';
import {ScopeObject, Scopes} from '@utilities/object';
import {Logger, LogPrefix} from '../../lib/log';
import {Activity} from './lib/config';
import {actions} from '../../actions';
import {
  Atom,
  Actions,
  ActionDefinition,
  ActionName,
  ActionListExecutor,
  Parameter,
  Parameters,
  ensureList_logger,
  isList,
  isAtom,
  ActionMethodState,
  ensureString,
  ensureList,
  isEmptyList,
  ensureFunction,
} from './lib/types';
import {GenericActionMethodState} from './lib/GenericInterpreter';
import {MicroAtom} from './microRunner';
import {execAction} from '../../actions/lisp-like/helpers/actions';

// const DEFAULT_DEBUG =
//   false;
// // true;
const DEFAULT_MAX_STEPS = 1000;
const DEFAULT_MAX_LEVELS = 100;

type ActionArg = string;
type ActionWithParamsArg = string[];

export class Runner<A> {
  maxLevels: number;
  maxSteps: number;
  scopes: Scopes<Atom>;
  actions: Actions;
  actionCount: number = 0;

  constructor(options: {maxLevels?: number; maxSteps?: number} = {}) {
    this.maxSteps =
      typeof options.maxSteps !== 'undefined'
        ? options.maxSteps
        : DEFAULT_MAX_STEPS;
    this.maxLevels =
      typeof options.maxLevels !== 'undefined'
        ? options.maxLevels
        : DEFAULT_MAX_LEVELS;
    this.scopes = new Scopes<Atom>();
    this.actions = actions;
  }

  async start({
    activity,
    action,
    scope,
  }: {
    activity: Activity | undefined;
    action: ActionArg | ActionWithParamsArg;
    scope: ScopeObject<Atom>;
  }) {
    // const id = this.actionCount++;
    // const level = 0;
    const state = this._initState();
    const logger = new Logger({
      level: state.level,
      id: this.actionCount,
      name: 'start',
    });

    logger.warn(`need to clean up the scopes on start`);
    this.scopes.push(scope);

    // logger.debug(`Using config file "${activity}"`);
    // const fullConfig = await read_config(activity);

    if (activity) {
      this.actions = {
        ...this.actions,
        ...activity.actions,
      };
    }
    logger.debug(`this.actions: ${Object.keys(this.actions).join(',')}`);

    // const actionDefinition = this._getConfigAction(activity, action);
    logger.debug(`Starting action "${action}"`);
    // const actionDefinition = this.getActionImplementation(action);

    // logger.debug(`Eval "${JSON.stringify(actionDefinition)}"`);
    const a = Array.isArray(action) ? action : [action];
    const result = await this.evaluate(a, undefined);

    logger.debug(`Exited with result ${JSON.stringify(result)}`);
  }

  async evaluate(
    param: Parameter,
    state_?: ActionMethodState<Atom>
  ): Promise<Parameter> {
    // const id = this.actionCount++;
    const id = this._incSteps();

    // const id = this.actionCount;
    const level = 0;
    const state: ActionMethodState<Atom> = state_
      ? state_
      : {
          scopes: this.scopes,
          runner: this,
          actions: this.actions,
          logger: new Logger({id, level, name: 'evaluate'}),
          evaluate: this.evaluate,
        };

    return await execAction<Atom>('eval', param, state);
  }

  _incLevel(state: {level: number}) {
    if (++state.level > this.maxLevels)
      throw new Error(
        `JsonScript: Script stack overflow. Script went deeper than ${this.maxLevels} levels. You can increase this value by setting maxLevels value in options.`
      );
  }
  //
  _decLevel(state: {level: number}) {
    if (--state.level < 0)
      throw new Error(`JsonScript: Script stack underflow.`);
  }
  //
  _incSteps() {
    if (++this.actionCount > this.maxSteps)
      throw new Error(
        `JsonScript: Script was run for more than ${this.maxSteps} steps. You can increase this value by setting maxSteps value in options.`
      );
    return this.actionCount;
  }

  _resetState(state: {level: number}): void {
    this.actionCount = 0;
    state.level = 0;
  }

  _initState(): {level: number} {
    this.actionCount = 0;
    return {
      level: 0,
    };
  }
}
