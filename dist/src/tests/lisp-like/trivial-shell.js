"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    base_dir: './demo',
    version: '2.5.22',
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