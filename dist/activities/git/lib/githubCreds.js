"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGithubToken = exports.readGithubToken = exports.readGithubUsername = void 0;
const lodash_1 = __importDefault(require("lodash"));
const git_config_1 = __importDefault(require("git-config"));
const gitCreds_1 = require("./gitCreds");
const GITHUB_HOSTNAME = 'github.com';
const GITHUB_USERNAME = 'github.user';
function readGithubUsername() {
    const gitcfg = git_config_1.default.sync();
    const username = lodash_1.default.get(gitcfg, GITHUB_USERNAME);
    if (!username)
        throw new Error(`Unable to read ${GITHUB_USERNAME} from ${gitCreds_1.GIT_CONFIG_FNAME}`);
    //console.log(`readGithubUsername(): "${username}"`);
    return username;
}
exports.readGithubUsername = readGithubUsername;
function readGithubToken() {
    const username = readGithubUsername();
    const credentials = (0, gitCreds_1.readSpecificGitCredentials)({
        hostname: GITHUB_HOSTNAME,
        username,
    });
    const token = credentials && credentials.password;
    if (!token) {
        throw new Error(`Github token not found for the user (using ${gitCreds_1.GIT_CONFIG_FNAME} and ${gitCreds_1.GIT_CREDENTIALS_FNAME})`);
    }
    //console.log(`readGithubToken(): "${token}"`);
    return token;
}
exports.readGithubToken = readGithubToken;
async function getGithubToken() {
    const username = readGithubUsername();
    const credentials = (0, gitCreds_1.readSpecificGitCredentials)({
        hostname: GITHUB_HOSTNAME,
        username,
    });
    const GITHUB_PAT_ENV = 'GITHUB_PERSONAL_ACCESS_TOKEN';
    // let token;
    if (process.env[GITHUB_PAT_ENV]) {
        console.log(`* Using ${GITHUB_PAT_ENV} var from environment`);
        return process.env[GITHUB_PAT_ENV];
    }
    else {
        console.log(`* Unable to get ${GITHUB_PAT_ENV} var from environment; trying to read from Git config`);
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
exports.getGithubToken = getGithubToken;
//# sourceMappingURL=githubCreds.js.map