import {Actions} from "../../lib/runner";

import {$ensureFile} from './$ensureFile'
import {$ensureNoFile} from './$ensureNoFile'
import {$cleanup} from './$cleanup'
import {$cp} from './$cp'
import {$copyResourcesRecursive} from './$copyResourcesRecursive'
import {$rm} from './$rm'
import {$zip} from './$zip'

export const actions: Actions = {
  $ensureFile,
  $ensureNoFile,
  cleanup: $cleanup,
  cp: $cp,
  copyResourcesRecursive: $copyResourcesRecursive,
  $rm,
  $zip: $zip,
}

export default actions;




