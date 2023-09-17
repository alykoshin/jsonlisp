"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    base_dir: './demo',
    version: '2.5.22',
    actions: {
        default: [
            'series',
            ['echo', 'This will test operators'],
            ['$expect', true],
            ['$expect', false],
            ['$expect', 1, 1],
            ['$expect', 1, 2],
            ['$expect', 'aaa', 'aaa'],
            ['$expect', 'aaa', 'bbb'],
        ],
    },
};
exports.default = exports.config;
//# sourceMappingURL=test-$expect.js.map