/** @format */

import {ScopeObject, Scopes} from '@utilities/object';
import {ErrorLevel, Logger} from '../../lib/log';
import type {Activities, Activity} from './startup/Activities';
import type {
  Atom,
  Actions,
  Parameter,
  Expression,
  EvaluateFn,
} from '../../actions/lisp-like/helpers/types';
import {type IState, State} from './lib/state';
import {Tracer, TracerConstructorOptions} from './lib/tracer';

import {actions as defaultActions} from '../../actions';

interface RunnerConstructorOptions extends TracerConstructorOptions {
  errorLevel?: ErrorLevel;
}

export class Runner {
  actions: Actions;
  // actionCount: number = 0;
  tracer: Tracer;
  errorLevel?: ErrorLevel;

  constructor({
    maxLevels,
    maxSteps,
    errorLevel,
  }: RunnerConstructorOptions = {}) {
    this.actions = defaultActions;
    this.tracer = new Tracer({maxLevels, maxSteps});
    this.errorLevel = errorLevel;
  }

  async init({
    activities,
    scope,
  }: {
    activities?: Activities;
    scope?: ScopeObject<Atom>;
  } = {}) {
    //
    // `this.actions` must be populated before creating `state`
    if (activities) {
      this.actions = {
        ...this.actions,
        ...activities.actions(),
      };
    }
    // st.logger.debug(`this.actions: ${Object.keys(this.actions).sort().join(',')}`);
    // console.log(`this.actions: ${Object.keys(this.actions).sort().join(',')}`);

    // const logLevel = activities?.logLevel ? activities?.logLevel : 'log';
    const logLevel =
      /* activities?.logLevel ? activities?.logLevel : */
      this.errorLevel ?? 'log';

    const scopes = scope ? new Scopes<Atom>([scope]) : new Scopes<Atom>();
    const st = new State({
      runner: this,
      scopes,
      errorLevel: logLevel,
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
