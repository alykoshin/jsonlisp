"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    base_dir: './demo',
    version: '2.5.22',
    actions: {
        default: [
            'list',
            ['$shelljs', 'echo', '\nThis is the output from shelljs echo method'],
            ['$shelljs', 'cd', 'dist'],
            ['assert-equal', ['$shelljs', 'pwd'], ['getcwd']],
            ['$shelljs', 'cd', '..'],
            ['assert-equal', ['$shelljs', 'pwd'], ['getcwd']],
        ],
    },
};
exports.default = exports.config;
//# sourceMappingURL=test-$shelljs.js.map