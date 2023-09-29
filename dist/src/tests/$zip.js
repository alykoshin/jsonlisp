"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    base_dir: '.',
    version: '0.0.0',
    actions: {
        default: [
            'list', [
                '$zip', {
                    file_names: ['.\\src\\tests\\data\\in\\',],
                    archive_prefix: 'dist',
                    out_dir: '.\\src\\tests\\data\\out\\',
                    exclude_files: [
                        'test1.txt',
                    ],
                }
            ],
        ],
    },
};
exports.default = exports.config;
//# sourceMappingURL=$zip.js.map