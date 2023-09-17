import {Actions} from "../lib/runner";

import {build} from './build/build'
import {copyBuildPkg} from './build/copyBuildPkg'
import {versionBump} from './build/version-bump'
import {yarnInstallProd} from "./build/yarnInstallProd";
import {ejsTemplates} from "./build/ejsTemplates";

import {$ensureFile} from './fs/$ensureFile'
import {$ensureNoFile} from './fs/$ensureNoFile'
import {cleanup} from './fs/cleanup'
import {cp} from './fs/cp'
import {copyResourcesRecursive} from './fs/copyResourcesRecursive'
import {rm} from './fs/rm'
import {zip} from './fs/zip'

import {echo} from './echo'
import {exec} from './exec'
import {operators} from './operators'
import {confirm} from './confirm'


import {when} from "./when";
import {actions as processActions} from "./process";
import {actions as expectActions} from "./$expect";

export const actions: Actions = {
  ...processActions,
  ...expectActions,

  build,
  confirm,
  copyBuildPkg,
  $ensureFile,
  $ensureNoFile,
  cleanup,
  cp,
  copyResourcesRecursive,

  // !!!
  echo,
  $print: echo,
  exec,
  $exec: exec,
  // !!!


  ejsTemplates,

  '+': operators,
  '-': operators,
  '*': operators,
  '/': operators,
  '%': operators,
  '=': operators,
  '/=': operators,
  '>': operators,
  '<': operators,
  '>=': operators,
  '<=': operators,
  'min': operators,
  'max': operators,
  'mod': operators,
  'rem': operators,
  'and': operators,
  'or': operators,
  'not': operators,

  rm,
  version: versionBump,
  when,
  yarnInstallProd: yarnInstallProd,
  zip: zip,
}

// type ActionKeys = keyof typeof actions




