/** @format */

import * as _ from 'lodash';
import {
  ActionDefinition,
  Parameters,
  ensureString,
} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';
import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {Octo} from './lib/octo';
import {Activity} from '../../apps/runner/startup/Activities';

const GIT_ACTIONS: ActionDefinition = {
  default: ['queryClean'],
  // "readGithubUsername": [
  //   "shell-command", ""
  // ],
  queryClean: [
    'list',
    // "$quote", [
    ['print', 'Ensuring Git directory is clean...'],
    ['shell-command', 'git status --untracked-files=no --porcelain'],
    // ]
  ],
  queryCommitHash: ['shell-command', 'git rev-parse --short HEAD'],
  queryBranch: ['shell-command', 'git rev-parse --abbrev-ref HEAD'],
  checkoutBranch: ['shell-command', 'git checkout "${branch}"'],
  add: ['shell-command', 'git add "${filename}"'],
  commit: ['shell-command', 'git commit -m "${message}"'],
  tag: ['shell-command', 'git commit -m "${message}"'],
  push: ['shell-command', 'git push --follow-tags'],
  getInit: 'git init',
  gitRemoteAdd:
    'git remote add origin https://github.com/${username}/${repository}.git',
  gitAddAll: 'git add --all',
  gitCommitFirst: 'git commit -am "First commit"',
  gitPushSetUpstream: 'git push --set-upstream origin master',
  testEcho: [
    //[
    'shell-command',
    //[
    // "$quote"
    'echo test1',
    'echo test2',
    //],
  ],

  initAndPush: [
    'shell-command',
    //[
    // "getInit",
    'git init',
    // [ "shell-command", "git init" ],
    //"gitRemoteAdd",
    'git remote add origin https://github.com/${username}/${repository}.git',
    // [ "shell-command", "git remote add origin https://github.com/${username}/${repository}.git" ],
    //"gitAddAll",
    //{ action: "gitAddAll", }
    'git add --all',
    //"gitCommitFirst",
    'git commit -am "First commit"',
    //"gitPushSetUpstream",
    'git push --set-upstream origin master',
    //],
  ],
  //initAndPush: [
  //  [ "$print", "initializing git repository" ],
  //  "shell-command", [
  //    "git init",
  //    "git remote add origin https://github.com/${username}/${repository}.git",
  //    "git add --all",`
  //    "git commit -am \"First commit\"",`
  //    "git push --set-upstream origin master",
  //  ],
  //],

  async ensureClean(_: string, args: Parameters, {evaluate, logger}: State) {
    validateArgs(args, {exactCount: 0});
    // const git_clean = await this.queryClean();
    // const git_clean = await this['queryClean']();
    const git_clean = await evaluate('queryClean');

    if (!git_clean) {
      logger.log(`Git directory is clean`);
    } else {
      const m = `* ERROR: Git directory not clean. Please commit or stash the changes before the build.`;
      logger.fatal(m);
      // throw new Error(m);
    }
  },

  async createGithubRepo(
    _: string,
    args: Parameters,
    {evaluate, runner, level, logger}: State
  ) {
    const [username, name, description] = validateArgs(args, {
      exactCount: 3,
    });
    ensureString(username);
    ensureString(name);
    ensureString(description);

    const octo = new Octo();
    await octo.createGithubRepo({username, name, description});
  },
};
export const activity: Activity = {
  base_dir: './',
  version: '0.0.0',
  actions: {
    default: ['print', 'No default action specified'], // will be overrided
    ...GIT_ACTIONS,
  },
};

export default activity;
