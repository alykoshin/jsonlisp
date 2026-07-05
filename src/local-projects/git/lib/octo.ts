/** @format */

import {Octokit} from 'octokit';
import {RequestError} from '@octokit/request-error';
import {GIT_CONFIG_FNAME, GIT_CREDENTIALS_FNAME} from './gitCreds';
import {getGithubToken, readGithubToken} from './githubCreds';

// type GitActionKey = keyof typeof GIT_ACTIONS;
//
// type GitActionsType = typeof GIT_ACTIONS;
// interface GitActivityWithActions extends GitActionsType, GitActivity {}
interface OctoOptions {}

export class Octo /*extends GenericActivity */ {
  octokit?: Octokit;
  options: OctoOptions;
  // spawn: Cmd
  constructor(options: OctoOptions = {}) {
    // super({}, options);
    // super();
    this.options = options || {};

    // this.spawn = Spawn();
  }

  _createOctokit() {
    const GIT_DEBUG = false;

    const token = getGithubToken();

    const octokit = new Octokit({
      auth: `token ${token}`,
      //auth: `token 1234567890abcdef`,
      /*
      auth: {
        username: 'username',
        password: 'password',
        async on2fa() {
          //  example: ask the user
          return prompt('Two-factor authentication Code:')
        },
      },
      */
      log: GIT_DEBUG
        ? console
        : {
            debug: () => {},
            info: () => {},
            warn: console.warn,
            error: console.error,
          },
    });
    return octokit;
  }

  // async ensureClean() {
  //   // const git_clean = await this.queryClean();
  //   const git_clean = await this['queryClean']();
  //
  //   if (!git_clean) {
  //     console.log(`Git directory is clean`);
  //   } else {
  //     const m = `* ERROR: Git directory not clean. Please commit or stash the changes before the build.`;
  //     console.error(m);
  //     throw new Error(m);
  //   }
  // }
  _checkGithubHttpError(e: Error) {
    if (e.name === 'HttpError' && (e as RequestError).status === 401) {
      console.error(`*`);
      console.error(`* This package uses:`);
      console.error(`*   github.user from ~/${GIT_CONFIG_FNAME}`);
      console.error(`*   token from ~/${GIT_CREDENTIALS_FNAME}`);
      console.error(`*`);
      console.error(
        '* Please ensure they are still valid (may also be removed by Github automatically if found in public repository):'
      );
      console.error('* https://github.com/settings/tokens');
      console.error('*');
      throw new Error('* Invalid Github credentials');
    } else {
      console.error(e);
    }
  }

  async createGithubRepo({
    username,
    name,
    description,
  }: {
    username: string;
    name: string;
    description: string;
  }) {
    if (!this.octokit) this.octokit = this._createOctokit();

    //console.log('createGithubRepo', { username, name, description })
    try {
      const res = await this.octokit.rest.repos.createForAuthenticatedUser({
        user: username,
        name,
        description,
        //type: 'public'
      });
      console.log('* repository successfully created');
      return true;
    } catch (e) {
      this._checkGithubHttpError(e as Error);
      throw e;
    }
    //this.octokit.repos.create({
    //    user:        this.githubName,
    //    name:        this.pkgName,
    //    description: this.pkgDesc
    //  }, function (err, res) {
    //    console.log('github.repos.create(): err:', err, 'res:', JSON.stringify(res));
    //  //self._gitInitAndPush(self.githubName, self.pkgName);
    //});
  }
}
