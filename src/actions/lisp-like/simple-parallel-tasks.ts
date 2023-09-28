import { fn_check_params } from '../../lib/util';
import { ActionMethodState, Actions, Parameters } from '../../lib/runner';

/**
 * simple-parallel-tasks
 * https://codeberg.org/glv/simple-parallel-tasks
 * 
 * The simple-parallel-tasks Reference Manual
 * https://quickref.common-lisp.net/simple-parallel-tasks.html
 */

export const actions: Actions = {

  'plist': async function (action, params, { evaluate, logger }) {
    fn_check_params(params, { minCount: 2 });
    const promises = params.map((a) => evaluate(a));
    return await Promise.all(promises);
  },

};

export default actions;

