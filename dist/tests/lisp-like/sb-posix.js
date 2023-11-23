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
            ['print',
                ['setq', 'orig_path',
                    ['getcwd']]],
            ['chdir', '/'],
            ['print',
                ['getcwd']],
            ['chdir', '${orig_path}'],
            ['print',
                ['getcwd']],
            ['setenv', 'setenv-test-key', 'setenv-test-value-1', 1],
            ['print', '>>>'],
            ['print',
                ['getenv', 'setenv-test-key']],
            ['setenv', 'setenv-test-key', 'setenv-test-value-2', 1],
            ['print', '>>>'],
            ['print',
                ['getenv', 'setenv-test-key']],
            ['setenv', 'setenv-test-key', 'setenv-test-value-2', 0],
            ['print', '>>>'],
            ['print',
                ['getenv', 'setenv-test-key']],
            ['unsetenv', 'setenv-test-key'],
            ['print', '>>>'],
            ['print',
                ['getenv', 'setenv-test-key']],
        ],
    },
};
exports.default = exports.config;
//# sourceMappingURL=sb-posix.js.map