/** @format */

/**
 * @module eval/environment
 * [model] The evaluation environment. JL is a Lisp-2: `actions` is the
 * function namespace, `scopes` the value namespace (see ARCHITECTURE.md,
 * divergence 3). Class is still named `State` — renamed to `Environment`
 * with a compat alias in the cycle-break phase.
 */

import {
  EvaluateFn,
  Actions,
  Atom,
  Expression,
  Parameter,
} from './sexpr';

import {Scopes} from '@utilities/object';
import {ErrorLevel, Logger} from '../lib/log';
import {Runner} from '../apps/runner/runner';
import {eval_} from './eval';

const GLOBAL_ACTION_ID = true;
let lastActionId = 0;

interface IStateInit {
  id?: number;
  level?: number;
  name?: string;
  names?: string[];

  runner: Runner;
  scopes?: Scopes<Atom>;
  logger?: Logger;
  errorLevel?: ErrorLevel;
}

export interface ILoggerState {
  id: number;
  level: number;
  // name: string;
  names: string[];
}

export interface IState extends IStateInit {
  id: number;
  evaluate: EvaluateFn;
}

export class State implements IState, ILoggerState {
  id: number;
  level: number;
  // name: string;
  names: string[];

  public runner: Runner;
  public scopes: Scopes<Atom>;
  public actions: Actions;
  public logger: Logger;

  constructor(init: IStateInit) {
    this.id = init.id === undefined ? 0 : init.id;
    this.level = init.level === undefined ? 0 : init.level;

    this.names = init.names?.slice() || ['*'];

    this.runner = init.runner;
    this.scopes = init.scopes == undefined ? new Scopes() : init.scopes.copy();
    this.actions = init.runner.actions;
    this.logger = init.logger ? init.logger : new Logger(this);
    if (init.errorLevel) this.logger.setErrorLevel(init.errorLevel);
    this.evaluate = this.evaluate.bind(this);
  }

  async evaluate(expr: Expression): Promise<Parameter> {
    this.logger.debug('state.evaluate -> eval');
    return await eval_('|', [expr], this);
  }

  new(): State {
    return new State(this);
  }

  next(): State {
    if (GLOBAL_ACTION_ID) {
      lastActionId++;
      this.id = lastActionId;
    } else {
      this.id++;
    }
    this.logger.debug('next');
    return this;
  }

  up(name: string): State {
    this.level++;
    // this.name = name;
    this.names.push(name);
    if (GLOBAL_ACTION_ID) {
      // lastActionId++;
      // this.id = lastActionId;
    } else {
      // lastActionId++;
      this.id = 0;
    }
    this.logger = this.logger.new(this);
    this.logger.debug('up');
    return this;
  }

  newNextUp(name: string): State {
    const res = this.new().up(name);
    res.logger = this.logger.new(res);
    return res;
  }
}
