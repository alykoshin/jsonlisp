"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    base_dir: '.',
    version: '0.0.0',
    actions: {
        default: [
            'list',
            ['assert-true', ['probe-file', 'package.json']],
            ['assert-false', ['probe-file', 'package.json---------']],
            ['directory', '.'],
        ],
    },
};
exports.default = exports.config;
//# sourceMappingURL=file-system.js.map