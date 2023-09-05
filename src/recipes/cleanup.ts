import {FullConfig} from "../lib/config";
import {Runner} from "../lib/runner";
import {removeDirRecursive} from '../lib/fsUtils'

export interface CleanupAction {
  action: 'cleanup'
  dirs: string[]
}

export async function action_cleanup(
  definition: CleanupAction,
  {id, fullConfig, runner}: { id: number | string, fullConfig: FullConfig, runner: Runner }
) {
  for (const d of definition.dirs) {
    runner.debug(id, `cleanup ${d}`)
    await removeDirRecursive(d);
  }
}
