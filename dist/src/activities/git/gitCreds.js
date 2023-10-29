"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSpecificGitCredentials = exports.readGitCredentials = exports.GIT_CREDENTIALS_FNAME = exports.GIT_CONFIG_FNAME = void 0;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
exports.GIT_CONFIG_FNAME = '.git-config'; // Used only for error messages while actual reading is implemented at external 'git-config' module
exports.GIT_CREDENTIALS_FNAME = '.git-credentials';
function readGitCredentials() {
    if (process.platform === 'win32') {
        throw new Error(`readGitCredentials() Not supported for Windows`);
    }
    const fname = path_1.default.resolve(os_1.default.homedir(), exports.GIT_CREDENTIALS_FNAME);
    const text = fs_1.default.readFileSync(fname, { encoding: 'utf8' });
    const lines = text.split(/\r?\n/);
    const credentials = [];
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
exports.readGitCredentials = readGitCredentials;
function readSpecificGitCredentials({ hostname, username, }) {
    //console.log(`readSpecificGitCredentials():`, {hostname, username});
    const credentials = readGitCredentials();
    const found = credentials.find((cred) => cred.hostname === hostname && cred.username === username);
    //console.log(`readSpecificGitCredentials():`, found);
    if (!found)
        throw new Error('Credentials not found');
    return found;
}
exports.readSpecificGitCredentials = readSpecificGitCredentials;
//# sourceMappingURL=gitCreds.js.map