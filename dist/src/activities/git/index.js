"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.activity = void 0;
const types_1 = require("../../apps/runner/lib/types");
const validateArgs_1 = require("../../apps/runner/lib/validateArgs");
const octo_1 = require("./lib/octo");
const GIT_ACTIONS = {
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
    gitRemoteAdd: 'git remote add origin https://github.com/${username}/${repository}.git',
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
    async ensureClean(_, args, { evaluate, logger }) {
        (0, validateArgs_1.validateArgs)(args, { exactCount: 0 });
        // const git_clean = await this.queryClean();
        // const git_clean = await this['queryClean']();
        const git_clean = await evaluate('queryClean');
        if (!git_clean) {
            logger.log(`Git directory is clean`);
        }
        else {
            const m = `* ERROR: Git directory not clean. Please commit or stash the changes before the build.`;
            logger.fatal(m);
            // throw new Error(m);
        }
    },
    async createGithubRepo(_, args, { evaluate, runner, level, logger }) {
        const [username, name, description] = (0, validateArgs_1.validateArgs)(args, {
            exactCount: 3,
        });
        (0, types_1.ensureString)(username);
        (0, types_1.ensureString)(name);
        (0, types_1.ensureString)(description);
        const octo = new octo_1.Octo();
        await octo.createGithubRepo({ username, name, description });
    },
};
exports.activity = {
    base_dir: './',
    version: '0.0.0',
    actions: {
        default: ['print', 'No default action specified'],
        ...GIT_ACTIONS,
    },
};
exports.default = exports.activity;
//# sourceMappingURL=index.js.map