"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    base_dir: './demo',
    version: '2.5.22',
    actions: {
        default: [
            '$series',
            ['$shelljs', 'echo', '\nthis is the output from shelljs echo method'],
            ['$shelljs', 'cd', 'dist'],
            ['$expect',
                ['$shelljs', 'pwd'], ['$cwd']],
            ['$shelljs', 'cd', '..'],
            ['$expect',
                ['$shelljs', 'pwd'], ['$cwd']],
        ],
    },
};
exports.default = exports.config;
//# sourceMappingURL=test-$shelljs.js.map