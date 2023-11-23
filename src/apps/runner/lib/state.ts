/** @format */

import {omit} from 'lodash';
import {
  EvaluateFn,
  Actions,
  Atom,
  Expression,
  Parameter,
} from '../../../actions/lisp-like/helpers/types';

import {Scopes} from '@utilities/object';
import {ErrorLevel, Logger} from '../../../lib/log';
import {Runner} from '../runner';
import {eval_, execNamedAction} from '../../../actions/lisp-like/core/eval';

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

// interface ILoggerState {
// id: number;
// level: number;
// name: string;
// }
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
    // Object.assign(this, init);
    this.id = init.id === undefined ? 0 : init.id;
    this.level = init.level === undefined ? 0 : init.level;
    // this.name = init.name || 'start';

    this.names = init.names?.slice() || ['*'];

    this.runner = init.runner;
    this.scopes = init.scopes == undefined ? new Scopes() : init.scopes.copy();
    this.actions = init.runner.actions;
    this.logger = init.logger ? init.logger : new Logger(this);
    if (init.errorLevel) this.logger.setErrorLevel(init.errorLevel);
    this.evaluate = this.evaluate.bind(this);
  }

  async evaluate(expr: Expression): Promise<Parameter> {
    // return this.runner.evaluate.call(this, expr, this);
    this.logger.debug('state.evaluate -> eval');
    // return await execNamedAction('eval', [expr], this);
    return await eval_('|', [expr], this);
  }

  new(): State {
    return new State(this);
    // return new State(omit(this, 'logger'));
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
