import { fn_check_params } from '../../lib/util';
import {
  Actions,
} from '../../lib/runner';
import { series } from '../../helpers/series';

export const actions: Actions = {
  $series: async function $series(action, params, { evaluate, logger }) {
    fn_check_params(params, { minCount: 1 });

    return series(params, evaluate);
  },
};

export default actions;
