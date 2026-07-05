/** @format */

import fs from 'fs';
import os from 'os';
import path from 'path';

export interface GitCredentials {
  protocol: string;
  username: string;
  password: string;
  hostname: string;
}

export const GIT_CONFIG_FNAME = '.git-config'; // Used only for error messages while actual reading is implemented at external 'git-config' module
export const GIT_CREDENTIALS_FNAME = '.git-credentials';

export function readGitCredentials() {
  if (process.platform === 'win32') {
    throw new Error(`readGitCredentials() Not supported for Windows`);
  }
  const fname = path.resolve(os.homedir(), GIT_CREDENTIALS_FNAME);
  const text = fs.readFileSync(fname, {encoding: 'utf8'});
  const lines = text.split(/\r?\n/);
  const credentials: GitCredentials[] = [];
  lines.forEach((line) => {
    // example: https://username:12345678abcdefgh@github.com
    const matches = line.match(/^(\S+):\/?\/?(\S+):(\S+)@([-a-zA-Z0-9\.]+)$/);
    if (matches && matches.length === 5)
      credentials.push({
        // match:  matches[0],
        protocol: matches[1],
        username: matches[2],
        password: matches[3],
        hostname: matches[4],
        // index: matches.index
        // input: matches.input
        // groups: matches.groups
      });
  });
  return credentials;
}

export function readSpecificGitCredentials({
  hostname,
  username,
}: {
  hostname: string;
  username: string;
}): GitCredentials {
  //console.log(`readSpecificGitCredentials():`, {hostname, username});
  const credentials = readGitCredentials();
  const found = credentials.find(
    (cred) => cred.hostname === hostname && cred.username === username
  );
  //console.log(`readSpecificGitCredentials():`, found);
  if (!found) throw new Error('Credentials not found');
  return found;
}
