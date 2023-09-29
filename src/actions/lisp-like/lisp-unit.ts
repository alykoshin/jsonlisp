/** @format */

import _ from 'lodash';

import {fn_check_params} from '../../lib/util';
import {
  ActionMethodState,
  Actions,
  AtomDefinition,
  Parameters,
} from '../../lib/runner';
import {Scope, Scopes} from '@utilities/object';

class Counter {
  name: string;
  scopes?: Scopes<AtomDefinition>;
  scope?: Scope<AtomDefinition>;
  constructor({name}: {name: string}) {
    this.name = name;
    // this.scopes = scopes;
    // this.scope = scopes.global();
  }
  setDefault(
    {scopes}: {scopes: Scopes<AtomDefinition>},
    defaultValue?: AtomDefinition
  ) {
    this.scopes = scopes;
    this.scope = scopes.global();
    if (typeof this.scope?.get(this.name) === 'undefined') {
      this.reset(
        {scopes},
        typeof defaultValue !== 'undefined' ? defaultValue : 0
      );
    }
  }
  reset(
    {scopes}: {scopes: Scopes<AtomDefinition>},
    defaultValue?: AtomDefinition
  ) {
    this.scopes = scopes;
    this.scope = scopes.global();
    this.scope?.set(this.name, defaultValue ? defaultValue : 0);
  }
  inc({scopes}: {scopes: Scopes<AtomDefinition>}, num?: number) {
    this.scopes = scopes;
    this.scope = scopes.global();
    const value = this.scope.get(this.name, 0);
    return this.scope.set(this.name, value + 1);
  }
}

const okCounter = new Counter({name: 'assert_ok_count'});
const failCounter = new Counter({name: 'assert_fail_count'});

/**
 *
 * lisp-unit -- Common Lisp library that supports unit testing
 * https://www.quicklisp.org/beta/UNOFFICIAL/docs/lisp-unit/doc/index.html
 *
 * What's the difference between `eq`, `eql`, `equal` and `equalp`, in Common Lisp? -- https://stackoverflow.com/questions/547436/whats-the-difference-between-eq-eql-equal-and-equalp-in-common-lisp
 *
 *
 * == alternative ==
 *
 * CLUnit -- Common Lisp Unit Test Framework
 * https://tgutu.github.io/clunit/
 *
 *
 */

export const actions: Actions = {
  'assert-true': async function (action, params, {evaluate, scopes, logger}) {
    fn_check_params(params, {minCount: 1});

    const pActual = await evaluate(params[0]);

    const bActual = !!pActual;
    const sActual = JSON.stringify(pActual);

    okCounter.setDefault({scopes});
    failCounter.setDefault({scopes});
    if (bActual) {
      let msg = `assert-x: OK:   `;
      msg += params[1] ? await evaluate(params[1]) : sActual;
      logger.success(msg);
      okCounter.inc({scopes});
    } else {
      let msg = `assert-x FAIL: `;
      msg += params[1] ? await evaluate(params[1]) : sActual;
      const printParams = params.slice(1);
      for (const p of printParams) {
        await evaluate(['print', p]);
      }
      logger.error(msg);
      failCounter.inc({scopes});
    }

    return bActual;
  },

  'assert-false': async function (action, params, {evaluate}) {
    fn_check_params(params, {minCount: 1});

    const cond = await evaluate(params[0]);

    return evaluate(['assert-true', !cond, ...params.slice(1)]);
  },

  'assert-equal': async function (action, params, {evaluate, logger}) {
    fn_check_params(params, {exactCount: [2, 3]});

    const actual = await evaluate(params[0]);
    logger.debug('actual', actual);

    const expected = await evaluate(params[1]);
    logger.debug('expected', expected);

    const res = _.isEqual(actual, expected);
    logger.debug('res', res);

    const sValue = JSON.stringify({actual, expected});

    return evaluate(['assert-true', res, params[2] || sValue]);
  },
};

export default actions;
