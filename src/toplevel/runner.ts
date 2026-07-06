/** @format */

import {ScopeObject, Scopes} from '@utilities/object';
import {ErrorLevel} from '../lib/log';
import type {Activities} from './Activities';
import type {Atom, Actions} from '../eval/sexpr';
import {State, makeEvaluator} from '../eval';
import {Tracer, TracerConstructorOptions} from '../eval/tracer';

import {defaultActions, assemble} from '../modules';

interface RunnerConstructorOptions extends TracerConstructorOptions {
  errorLevel?: ErrorLevel;
}

export class Runner {
  /** The image — BUILT in init() (assembly cold-loads the JL-written
   * kernel vocabulary; see modules/assemble), not a static constant. */
  actions: Actions = {};
  tracer: Tracer;
  errorLevel?: ErrorLevel;

  constructor({
    maxLevels,
    maxSteps,
    errorLevel,
  }: RunnerConstructorOptions = {}) {
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
    // `this.actions` must be populated before creating the environment.
    // like CL's (require :sb-posix): an activity may restrict the
    // vocabulary to core + declared packages (see modules/assemble)
    const requires = activities?.requires();
    const base = requires ? await assemble(requires) : await defaultActions();
    this.actions = activities ? {...base, ...activities.actions()} : base;

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
