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