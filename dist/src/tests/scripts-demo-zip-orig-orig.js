"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    base_dir: './demo',
    version: '2.5.23',
    actions: {
        default: ['$series',
            ['$parallel',
                ['$build', { cwd: './demo', env: { CONFIG_ENV: 'top100' } }],
                ['$build', { cwd: './demo', env: { CONFIG_ENV: 'stats-top100', } }]],
            ['$version', 'patch'],
            ['$zip',
                {
                    file_names: [
                        './dist/',
                    ],
                    archive_prefix: 'dist',
                    out_dir: '../_archive',
                    exclude_files: [
                        'index.html',
                        'index.js',
                        'minimal.html',
                        'fp.ico',
                        'fp.png',
                        'ldr.js.LICENSE.txt',
                    ],
                },
            ],
        ],
    },
};
exports.default = exports.config;
//# sourceMappingURL=scripts-demo-zip-orig-orig.js.map