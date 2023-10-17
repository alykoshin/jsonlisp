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
import type {State as State, EvState} from './lib/state';
// import {curry} from '../../lib/curry';
import {Tracer, TracerConstructorOptions} from './lib/tracer';

import {actions} from '../../actions';
import {execNamedAction} from '../../actions/lisp-like/core/eval';

// const DEFAULT_DEBUG = false;
const DEFAULT_DEBUG = true;

interface RunnerConstructorOptions extends TracerConstructorOptions {}

export class Runner {
  // scopes: Scopes<T>;
  actions: Actions;
  actionCount: number = 0;
  tracer: Tracer;

  constructor({maxLevels, maxSteps}: RunnerConstructorOptions = {}) {
    // this.scopes = new Scopes<T>();
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
    // `this.actions` must be populated before creating `state`
    if (activity) {
      this.actions = {
        ...this.actions,
        ...activity.actions,
      };
    }
    // const args = Array.isArray(action) ? action : [action];
    const scopes = scope ? new Scopes<Atom>([scope]) : new Scopes<Atom>();
    const st: EvState = {
      actions: this.actions,
      logger: new Logger({id: this.actionCount, level: 0, name: 'start'}),
      runner: this,
      scopes,
      // evaluate: runner.evaluate,
    };
    // const st: State = {
    // ...initState,
    // evaluate,
    // };
    // state.evaluate = evCurry.call(runner, runner.evaluate, state);
    this.tracer.reset();

    st.logger.warn(`need to clean up the scopes on start`);
    st.logger.debug(`this.actions: ${Object.keys(this.actions).join(',')}`);

    return st;
  }

  async start(args: string[], st: EvState) {
    st.logger.debug(`Starting action "${JSON.stringify(args)}"`);

    const result = await this.evaluate(args, st);
    // return await execNamedAction('eval', a, { ...st, );

    st.logger.debug(`Exited with result ${JSON.stringify(result)}`);
  }

  async evaluate(expr: Expression, st: EvState): Promise<Parameter> {
    const evaluate: EvaluateFn = async (expr: Expression) =>
      await this.evaluate(expr, st);
    st.logger.debug('runner.evaluate:', expr);
    return await execNamedAction('eval', [expr], {...st, evaluate});
  }
}
