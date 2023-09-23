import {Actions} from "../lib/runner";

import {$build} from './build/$build'
import {$copyBuildPkg} from './build/$copyBuildPkg'
import {$versionBump} from './build/$version-bump'
import {$yarnInstallProd} from "./build/$yarnInstallProd";
import {$ejsTemplates} from "./build/$ejsTemplates";

import {$ensureFile} from './fs/$ensureFile'
import {$ensureNoFile} from './fs/$ensureNoFile'
import {$cleanup} from './fs/$cleanup'
import {$cp} from './fs/$cp'
import {$copyResourcesRecursive} from './fs/$copyResourcesRecursive'
import {$rm} from './fs/$rm'
import {$zip} from './fs/$zip'

import {$echo} from './$echo'
import {$exec} from './$exec'

import lispLike from './lisp-like'

import {$confirm} from './$confirm'

import $sbcl from "./$sbcl";

import $processActions from "./process";
import $expectActions from "./$expect";
import $shelljsActions from "./$shelljs";
import $cwdActions from "./$cwd";

export const actions: Actions = {
  ...$processActions,
  ...$expectActions,
  ...$shelljsActions,
  ...$cwdActions,
  ...lispLike,

  build: $build,
  $confirm,
  $copyBuildPkg,
  $ensureFile,
  $ensureNoFile,
  cleanup: $cleanup,
  cp: $cp,
  copyResourcesRecursive: $copyResourcesRecursive,

  $echo: $echo,
  $print: $echo,
  $exec: $exec,

  $ejsTemplates: $ejsTemplates,

  $rm,
  $version: $versionBump,
  $yarnInstallProd: $yarnInstallProd,
  $zip: $zip,
}

// type ActionKeys = keyof typeof actions




