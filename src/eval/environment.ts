/** @format */

/**
 * @module eval/environment
 * [model] The evaluation environment. JL is a Lisp-2: `actions` is the
 * function namespace, `scopes` the value namespace (see ARCHITECTURE.md,
 * divergence 3).
 *
 * The evaluator is injected (`evalFn`) rather than imported — the same shape
 * that lets SBCL swap sb-eval/sb-fasteval behind one interface. Wire it with
 * makeEvaluator() from eval/index.
 */

import {
  EvaluateFn,
  ExecutorFn,
  Actions,
  Atom,
  Expression,
  Parameter,
} from './sexpr';

import {Scopes} from '@utilities/object';
import {ErrorLevel, Logger} from '../lib/log';

export type {ILoggerState} from '../lib/log';
import type {ILoggerState} from '../lib/log';

const GLOBAL_ACTION_ID = true;
let lastActionId = 0;

interface IEnvironmentInit {
  id?: number;
  level?: number;
  name?: string;
  names?: string[];

  actions: Actions;
  evalFn?: ExecutorFn;
  scopes?: Scopes<Atom>;
  logger?: Logger;
  errorLevel?: ErrorLevel;
}

export interface IState extends IEnvironmentInit {
  id: number;
  evaluate: EvaluateFn;
}

const evalNotWired: ExecutorFn = async () => {
  throw new Error(
    `Evaluator not wired into the environment — construct it via makeEvaluator() (eval/index)`
  );
};

export class Environment implements IState, ILoggerState {
  id: number;
  level: number;
  // name: string;
  names: string[];

  public scopes: Scopes<Atom>;
  public actions: Actions;
  public evalFn: ExecutorFn;
  public logger: Logger;

  constructor(init: IEnvironmentInit) {
    this.id = init.id === undefined ? 0 : init.id;
    this.level = init.level === undefined ? 0 : init.level;

    this.names = init.names?.slice() || ['*'];

    this.actions = init.actions;
    this.evalFn = init.evalFn ?? evalNotWired;
    this.scopes = init.scopes == undefined ? new Scopes() : init.scopes.copy();
    this.logger = init.logger ? init.logger : new Logger(this);
    if (init.errorLevel) this.logger.setErrorLevel(init.errorLevel);
    this.evaluate = this.evaluate.bind(this);
  }

  async evaluate(expr: Expression): Promise<Parameter> {
    this.logger.debug('state.evaluate -> eval');
    return await this.evalFn('|', [expr], this);
  }

  new(): Environment {
    return new Environment(this);
  }

  next(): Environment {
    if (GLOBAL_ACTION_ID) {
      lastActionId++;
      this.id = lastActionId;
    } else {
      this.id++;
    }
    this.logger.debug('next');
    return this;
  }

  up(name: string): Environment {
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

  newNextUp(name: string): Environment {
    const res = this.new().up(name);
    res.logger = this.logger.new(res);
    return res;
  }
}

/** Historical name — every action signature uses it. */
export {Environment as State};
