import { Actions } from '../../lib/runner';

import confirm from './$confirm';
import $cwdActions from './$cwd';
import $shelljsActions from './$shelljs';

export const actions: Actions = {
  ...confirm,
  ...$cwdActions,
  ...$shelljsActions,
};

export default actions;
