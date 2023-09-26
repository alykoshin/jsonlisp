import {Actions} from "../../lib/runner";

import {$build} from './$build'
import {$copyBuildPkg} from './$copyBuildPkg'
import $versionActions from './$version'
import {$yarnInstallProd} from "./$yarnInstallProd";
import {$ejsTemplates} from "./$ejsTemplates";

export const actions: Actions = {
  ...$versionActions,
  build: $build,
  $copyBuildPkg,
  $ejsTemplates: $ejsTemplates,
  $yarnInstallProd: $yarnInstallProd,
}

export default actions;




