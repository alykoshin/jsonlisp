import { fn_check_params } from '../../lib/util';
import { ActionMethodState, Actions, Parameters } from '../../lib/runner';
import { print } from '../../helpers/print';

export const actions: Actions = {
  prin1: async function (action, params, { evaluate, logger }) {
    fn_check_params(params, { exactCount: 1 });

    const pValue = await evaluate(params[0]);
    const toPrint = JSON.stringify(pValue);

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
    const toPrint = JSON.stringify(pValue);
  
    print(toPrint, '\n');
    return pValue;
  },
};

export default actions;
