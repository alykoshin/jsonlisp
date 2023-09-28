import { Actions } from '../../lib/runner';

import $shelljsActions from './$shelljs';

export const actions: Actions = {
  ...$shelljsActions,
};

export default actions;
