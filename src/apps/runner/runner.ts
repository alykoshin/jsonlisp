/** @format */

import {ScopeObject, Scopes} from '@utilities/object';
import {Logger} from '../../lib/log';
import type {Activity} from './lib/config';
import type {
  Atom,
  Actions,
  Parameter,
  Expression,
  EvaluateFn,
} from './lib/types';
import {type IState, State} from './lib/state';
import {Tracer, TracerConstructorOptions} from './lib/tracer';

import {actions} from '../../actions';
import {execNamedAction} from '../../actions/lisp-like/core/eval';

// const DEFAULT_DEBUG = false;
const DEFAULT_DEBUG = true;

interface RunnerConstructorOptions extends TracerConstructorOptions {}

export class Runner {
  actions: Actions;
  // actionCount: number = 0;
  tracer: Tracer;

  constructor({maxLevels, maxSteps}: RunnerConstructorOptions = {}) {
    this.actions = actions;
    this.tracer = new Tracer({maxLevels, maxSteps});
  }

  async init({
    activity,
    scope,
  }: {
    activity?: Activity;
    scope?: ScopeObject<Atom>;
  } = {}) {
    //
    // `this.actions` must be populated before creating `state`
    if (activity) {
      this.actions = {
        ...this.actions,
        ...activity.actions,
      };
    }
    // st.logger.debug(`this.actions: ${Object.keys(this.actions).join(',')}`);

    const scopes = scope ? new Scopes<Atom>([scope]) : new Scopes<Atom>();
    const st = new State({
      runner: this,
      scopes,
    });
    st.logger.warn(`need to clean up the scopes on start`);
    return st;
  }

  async start(args: string[], st: State) {
    st.logger.debug(`Starting action "${JSON.stringify(args)}"`);

    const result = await st.evaluate(args);
    // return await execNamedAction('eval', a, { ...st, );

    st.logger.debug(`Exited with result ${JSON.stringify(result)}`);
  }

  // async evaluate(expr: Expression, st: State): Promise<Parameter> {
  //   // const evaluate: EvaluateFn = async (expr: Expression) =>
  //   // await this.evaluate(expr, st);
  //   st.logger.debug('runner.evaluate:', expr);
  //   return await execNamedAction('eval', [expr], st);
  // }
}
