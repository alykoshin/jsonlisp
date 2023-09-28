import { fn_check_params } from '../../lib/util';
import { ActionMethodState, Actions, Parameters } from '../../lib/runner';
import { print, stringify } from './helpers/print';
import { confirm as confirm_ } from './helpers/confirm';

/**
 * The Common Lisp Cookbook – Files and Directories
 * https://lispcookbook.github.io/cl-cookbook/files.html#writing-content-to-a-file
 * 
 * How can I read the contents of a file into a list in Lisp?
 * https://stackoverflow.com/questions/3813895/how-can-i-read-the-contents-of-a-file-into-a-list-in-lisp
 * 
 * Saving to file in Lisp
 * https://stackoverflow.com/questions/5440744/saving-to-file-in-lisp
 * 
 * How to create and write into text file in Lisp
 * https://stackoverflow.com/questions/9495376/how-to-create-and-write-into-text-file-in-lisp
 */
export const actions: Actions = {
  prin1: async function (action, params, { evaluate, logger }) {
    fn_check_params(params, { exactCount: 1 });

    const pValue = await evaluate(params[0]);
    const toPrint = stringify(pValue);

    print(toPrint);
    return pValue;
  },

  princ: async function (action, params, { evaluate, logger }) {
    fn_check_params(params, { exactCount: 1 });

    const pValue = await evaluate(params[0]);

    print(pValue, '\n');
    return pValue;
  },

  print: async function (action, params, { evaluate, logger }) {
    fn_check_params(params, { exactCount: 1 });

    const pValue = await evaluate(params[0]);
    const toPrint = stringify(pValue);
  
    print(toPrint, '\n');
    return pValue;
  },

  /**
   * yes-or-no-p
   * 
   * https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node201.html
   * http://www.ai.mit.edu/projects/iiip/doc/CommonLISP/HyperSpec/Body/fun_y-or-n-pcm_yes-or-no-p.html
   */
  'y-or-n-p': async function (
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const { runner, logger } = state;
    fn_check_params(parameters, { exactCount: [0, 1] });

    const value =
      parameters.length === 1
        ? String(await runner.eval(parameters[0], state))
        : 'Confirm y/[N]?';
    const res = await confirm_(value);

    logger.info(`confirm: ${res}`);
    return res;
  },

};

export default actions;
