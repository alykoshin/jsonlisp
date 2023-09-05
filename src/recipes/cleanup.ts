import * as path from 'path';
import * as fs from 'fs/promises';
import {ReleaseType} from "semver";
import {FullConfig} from "../lib/config";
import {Runner} from "../lib/runner";
import {VersionAction} from "./version";

async function removeDirRecursive(dirname: string) {
  return fs.rm(dirname, {recursive: true})
    .catch(e => {
      if (e.code !== 'ENOENT') throw e; // be silent if dir doesn't exists
    });
}

export interface CleanupAction {
  action: 'cleanup'
  dirs: string[]
}

export async function action_cleanup(
  definition: CleanupAction,
  {id, fullConfig, runner}: { id: number | string, fullConfig: FullConfig, runner: Runner }
) {
  for (const d of definition.dirs) {
    await removeDirRecursive(d);
  }
}
