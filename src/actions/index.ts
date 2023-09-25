import {Actions} from "../lib/runner";

import {$build} from './build/$build'
import {$copyBuildPkg} from './build/$copyBuildPkg'
import $versionActions from './build/$version'
import {$yarnInstallProd} from "./build/$yarnInstallProd";
import {$ejsTemplates} from "./build/$ejsTemplates";

import {$ensureFile} from './fs/$ensureFile'
import {$ensureNoFile} from './fs/$ensureNoFile'
import {$cleanup} from './fs/$cleanup'
import {$cp} from './fs/$cp'
import {$copyResourcesRecursive} from './fs/$copyResourcesRecursive'
import {$rm} from './fs/$rm'
import {$zip} from './fs/$zip'

import {$echo} from './os/$echo'
import {$exec} from './os/$exec'

import lispLike from './lisp-like'

import {$confirm} from './os/$confirm'

import $sbcl from "./$sbcl";

import $processActions from "./process/";
import $miscActions from "./misc/";
import $shelljsActions from "./os/$shelljs";
import $cwdActions from "./os/$cwd";

export const actions: Actions = {
  ...$versionActions,

  ...$processActions,
  ...$miscActions,
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
  $yarnInstallProd: $yarnInstallProd,
  $zip: $zip,
}

// type ActionKeys = keyof typeof actions




