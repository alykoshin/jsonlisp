import fs from 'fs/promises';
import {FullConfig} from "../lib/config";
import {Runner} from "../lib/runner";

export interface CpAction {
  action: 'cp'
  source: string | string[]
  dest: string
  dry: boolean
}

export async function action_cp(
  definition: CpAction,
  {id, fullConfig, runner}: { id: number | string, fullConfig: FullConfig, runner: Runner }
) {
  const sources = Array.isArray(definition.source) ? definition.source : [definition.source];
  for (let src of sources) {
    runner.debug(id, `[cp] copying "${src}"`)
    if (definition.dry) {
      runner.debug(id, `[rm] "dry" flag is set; skipping`);
    } else {
      await fs.cp(src, definition.dest);
    }
  }
  runner.debug(id, `[cp] copied ${sources.length} dirs/files`)
}


async function copyBuildPkg() {
}

