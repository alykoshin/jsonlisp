import { fn_check_params } from '../../lib/util';
import { ActionMethodState, Actions, Parameters } from '../../lib/runner';
import { stringify } from './helpers/print';

/**
 * simple-parallel-tasks
 * https://codeberg.org/glv/simple-parallel-tasks
 * 
 * The simple-parallel-tasks Reference Manual
 * https://quickref.common-lisp.net/simple-parallel-tasks.html
 */

export const actions: Actions = {

  'chdir': async function (action, params, { evaluate, logger }) {
    fn_check_params(params, { exactCount: 1 });
    const pCwd = await evaluate(params[0]);
    const sCwd = String(pCwd);
    const res = process.chdir(sCwd);
    return res;
},

 'getcwd': async function (action, params, { evaluate, logger }) {
    fn_check_params(params, { exactCount: 0 });
    const res = process.cwd();
    logger.debug(stringify(res));
    return res;

},

};

export default actions;

