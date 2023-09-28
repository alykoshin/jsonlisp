import { Actions } from "../../lib/runner";

// import { $build } from "./$build";
import { $copyBuildPkg } from "./$copyBuildPkg";
import $versionActions from "./$version";
import { $yarnInstallProd } from "./$yarnInstallProd";
import { $ejsTemplates } from "./$ejsTemplates";

import { $ensureFile } from "./$ensureFile";
import { $ensureNoFile } from "./$ensureNoFile";
import { $cleanup } from "./$cleanup";
import { $cp } from "./$cp";
import { $copyResourcesRecursive } from "./$copyResourcesRecursive";
import { $rm } from "./$rm";
import { $zip } from "./$zip";

export const actions: Actions = {
  ...$versionActions,
  // build: $build,
  $copyBuildPkg,
  $ejsTemplates: $ejsTemplates,
  $yarnInstallProd: $yarnInstallProd,

  $ensureFile,
  $ensureNoFile,
  cleanup: $cleanup,
  cp: $cp,
  copyResourcesRecursive: $copyResourcesRecursive,
  $rm,
  $zip: $zip,
};

export default actions;
