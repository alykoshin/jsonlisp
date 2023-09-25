"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    base_dir: './demo',
    version: '2.5.22',
    actions: {
        default: ['$series',
            ['test_setq'],
        ],
        "test_setq": ['$series',
            ['setq', 'abc', 1],
            ['$expect', '${abc}', 1],
        ]
    },
};
exports.default = exports.config;
//# sourceMappingURL=defining-variables-and-functions.js.map