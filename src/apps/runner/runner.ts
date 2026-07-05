/** @format */

import {ScopeObject, Scopes} from '@utilities/object';
import {ErrorLevel} from '../../lib/log';
import type {Activities} from './startup/Activities';
import type {Atom, Actions} from '../../eval/sexpr';
import {State, makeEvaluator} from '../../eval';
import {Tracer, TracerConstructorOptions} from '../../eval/tracer';

import {actions as defaultActions} from '../../actions';

interface RunnerConstructorOptions extends TracerConstructorOptions {
  errorLevel?: ErrorLevel;
}

export class Runner {
  actions: Actions;
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
    // `this.actions` must be populated before creating the environment
    if (activities) {
      this.actions = {
        ...this.actions,
        ...activities.actions(),
      };
    }

    const logLevel = this.errorLevel ?? 'log';

    const scopes = scope ? new Scopes<Atom>([scope]) : new Scopes<Atom>();
    // Scopes are constructed fresh from the data param on every init —
    // nothing carries over between runs (the old "clean up the scopes"
    // warning was vestigial).
    const st = makeEvaluator({
      actions: this.actions,
      scopes,
      errorLevel: logLevel,
      tracer: this.tracer,
    });
    return st;
  }

  async start(args: string[], st: State) {
    st.logger.debug(`Starting action "${JSON.stringify(args)}"`);

    const result = await st.evaluate(args);

    st.logger.debug(`Exited with result ${JSON.stringify(result)}`);
  }
}
