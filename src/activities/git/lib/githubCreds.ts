/** @format */

import _ from 'lodash';
import gitconfig from 'git-config';
import {
  GIT_CONFIG_FNAME,
  readSpecificGitCredentials,
  GIT_CREDENTIALS_FNAME,
} from './gitCreds';

const GITHUB_HOSTNAME = 'github.com';
const GITHUB_USERNAME = 'github.user';

export function readGithubUsername(): string {
  const gitcfg = gitconfig.sync();

  const username = _.get(gitcfg, GITHUB_USERNAME);
  if (!username)
    throw new Error(
      `Unable to read ${GITHUB_USERNAME} from ${GIT_CONFIG_FNAME}`
    );
  //console.log(`readGithubUsername(): "${username}"`);
  return username;
}

export function readGithubToken(): string {
  const username = readGithubUsername();
  const credentials = readSpecificGitCredentials({
    hostname: GITHUB_HOSTNAME,
    username,
  });
  const token = credentials && credentials.password;
  if (!token) {
    throw new Error(
      `Github token not found for the user (using ${GIT_CONFIG_FNAME} and ${GIT_CREDENTIALS_FNAME})`
    );
  }
  //console.log(`readGithubToken(): "${token}"`);
  return token;
}

export async function getGithubToken(): Promise<string> {
  const username = readGithubUsername();
  const credentials = readSpecificGitCredentials({
    hostname: GITHUB_HOSTNAME,
    username,
  });
  const GITHUB_PAT_ENV = 'GITHUB_PERSONAL_ACCESS_TOKEN';

  // let token;
  if (process.env[GITHUB_PAT_ENV]) {
    console.log(`* Using ${GITHUB_PAT_ENV} var from environment`);
    return process.env[GITHUB_PAT_ENV];
  } else {
    console.log(
      `* Unable to get ${GITHUB_PAT_ENV} var from environment; trying to read from Git config`
    );
    return await readGithubToken();
  }

  // const token = credentials && credentials.password;
  // if (!token) {
  //   throw new Error(
  //     `Github token not found for the user (using ${GIT_CONFIG_FNAME} and ${GIT_CREDENTIALS_FNAME})`
  //   );
  // }
  // //console.log(`readGithubToken(): "${token}"`);
  // return token;
}
