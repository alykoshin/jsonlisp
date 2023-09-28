import _ from 'lodash';

import { fn_check_params } from '../../lib/util';
import {
  ActionMethodState,
  Actions,
  AtomDefinition,
  Parameters,
} from '../../lib/runner';

export const actions: Actions = {
  error: async function error(action, params, { evaluate, logger }) {
    fn_check_params(params, { exactCount: 1 });

    const pValue = await evaluate(params[0]);
    const sValue = String(pValue);

    logger.fatal(sValue);
  },

  /**
   *
   * https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node336.html
   *
   */
  assert: async function (action, params, { evaluate, scopes, logger }) {
    fn_check_params(params, { exactCount: [1, 2] });

    const actual = await evaluate(params[0]);
    // console.log('>>>', actual)

    const res = !!actual;
    const sValue = JSON.stringify(actual);

    if (!res) {
      let msg = `Assert failed: `;
      msg += params[1] ? (msg = String(await evaluate(params[1]))) : sValue;
      logger.fatal(msg);
    }

    return res;
  },

};

export default actions;
