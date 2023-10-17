"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// prettier-ignore
exports.config = {
    base_dir: '.',
    version: '0.0.0',
    actions: {
        default: [
            'list',
            ['shell-command', 'cmd /c echo "exec "cmd /c echo""'],
            ['shell-command', 'git status --untracked-files=no --porcelain'],
            ['shell-command', 'node --version', 'npm  --version', 'yarn --version'],
        ],
    },
};
exports.default = exports.config;
//# sourceMappingURL=trivial-shell.js.map