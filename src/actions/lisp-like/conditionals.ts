/** @format */

import { fn_check_params } from '../../lib/util';
import {
  ActionDefinition,
  ActionMethodState,
  Actions,
  Parameter,
  Parameters,
} from '../../lib/runner';
import { series, seriesLast } from './helpers/series';

export const actions: Actions = {
  if: async function (action, params, { evaluate, logger }) {
    fn_check_params(params, { exactCount: [2, 3] });
    const [pTest, pThen, pElse] = params;

    const condition = !!(await evaluate(pTest));
    logger.debug(`if: condition: ` + JSON.stringify(condition));

    if (condition) {
      return await evaluate(pThen);
    } else {
      if (typeof pElse !== 'undefined') {
        return await evaluate(pElse);
      }
    }

    return null;
  },

  cond: async function (action, params, { evaluate, logger }) {
    fn_check_params(params, { minCount: 1 });

    for (const i in params) {
      const [test, ...forms] = params[i] as Parameters;
      const condition = await evaluate(test);
      // logger.debug(`cond[{$i}]: condition:`, JSON.stringify(condition));
      logger.debug(`cond[${i}]: condition:`, condition);
      if (condition) {
        return seriesLast(forms, evaluate);
      }
    }

    return null;
  },

  when: async function (action, params, { evaluate, logger }) {
    fn_check_params(params, { exactCount: 2 });
    const [testClause, actionWhenTrue] = params;

    const condition = await evaluate(testClause);
    logger.debug(`when: condition: ` + JSON.stringify(condition));

    if (condition) {
      return await evaluate(actionWhenTrue);
    }

    return null;
  },

  unless: async function (action, params, { evaluate, logger }) {
    fn_check_params(params, { exactCount: 2 });
    const [testClause, actionWhenFalse] = params;

    const condition = await evaluate(testClause);
    logger.debug(`unless: condition: ` + JSON.stringify(condition));

    if (!condition) {
      return await evaluate(actionWhenFalse);
    }

    return null;
  },
};

export default actions;
