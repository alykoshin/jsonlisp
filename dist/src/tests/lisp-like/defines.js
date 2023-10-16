"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    base_dir: '.',
    version: '0.0.0',
    actions: {
        default: ['list',
            ['test_setq'],
        ],
        "test_setq": ['list',
            ['setq', 'abc', 1],
            ['assert-equal', '${abc}', 1],
        ],
        'testTemplate': ['print', 'This output is based on template and scope: { test: "${test}" }'],
    },
};
exports.default = exports.config;
//# sourceMappingURL=defines.js.map