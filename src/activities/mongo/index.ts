/** @format */

import * as path from 'path';
import {Activity} from '../../apps/runner/startup/Activities';
import {State} from '../../apps/runner/lib/state';
import {Actions} from '../../actions/lisp-like/helpers/types';

const MONGO_ACTIONS: Actions = {
  default: ['print', `Please run one of $backup|$restore actions`],
  $backup: [
    'list',
    ['print', 'Backing up database...'],
    ['_calcBackupDir'],
    ['print', 'mongodump --host ${host} --port ${port}  --out "${dir}"'],
    ['print', 'Done.'],
  ],
  $restore: [
    'list',
    ['print', 'Restoring database...'],
    ['_calcBackupDir'],
    [
      'print',
      'mongorestore --host ${host} --port ${port}  --dir "${dir}" ${ drop_on_restore ? "--drop" : ""}',
    ],
    ['print', 'Done.'],
  ],
  async _calcBackupDir(_, params, {scopes}: State) {
    const nowStr = new Date().toISOString();
    const baseDir = String(scopes.get('baseDir'));
    const dir = path.join(baseDir, nowStr);
    // return dir;
    scopes.current().set('dir', dir);
  },
};

export const activity: Activity = {
  base_dir: './demo',
  version: '0.0.0',
  actions: {
    default: ['print', 'No default action specified'], // will be overrided
    ...MONGO_ACTIONS,
  },
};

export default activity;
