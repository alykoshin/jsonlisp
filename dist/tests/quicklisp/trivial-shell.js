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
            ['test-shell-command'],
            ['test-get-env-var'],
            ['princ', 'assert-x:\n' + '  OK:   ${ assert_ok_count }\n' + '  FAIL: ${ assert_fail_count }'],
        ],
        'test-shell-command': ['list',
            // stdout is trimmed by the exec helper
            ['assert-equal', ['shell-command', 'node -e "console.log(42)"'], '42'],
            // several commands -> list of stdouts
            ['assert-equal',
                ['shell-command', 'node -e "console.log(1)"', 'node -e "console.log(2)"'],
                ['quote', ['1', '2']]],
            // smoke: exit code 0 is enough
            ['shell-command', 'git status --untracked-files=no --porcelain'],
            ['shell-command', 'node --version'],
        ],
        'test-get-env-var': ['list',
            ['setenv', 'JL_TSHELL_TEST', 'hello', 1],
            ['assert-equal', ['get-env-var', 'JL_TSHELL_TEST'], 'hello'],
            ['unsetenv', 'JL_TSHELL_TEST'],
            ['assert-equal', ['os-process-id'], ['os-process-id']],
        ],
    },
};
exports.default = exports.config;
//# sourceMappingURL=trivial-shell.js.map