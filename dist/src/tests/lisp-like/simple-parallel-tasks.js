"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    base_dir: './demo',
    version: '2.5.22',
    actions: {
        default: ['list',
            // ['test-plist1'],
            ['test-plist2'],
        ],
        'test-plist1': ['list',
            ['print', 'plist-1'],
            ['plist',
                ['list',
                    ['print', 'series-2-parallel-1-series-1'],
                    ['sleep', ['+', 0.1, 0.2, 0.7]],
                    ['print', 'series-2-parallel-1-series-2']],
                ['list',
                    ['print', 'series-2-parallel-2-series-1'],
                    ['sleep', ['*', 1, 1, 1]],
                    ['print', 'series-2-parallel-2-series-2']],
            ]
        ],
        'test-plist2': ['list',
            ['print', 'plist-2'],
            ['plist',
                ['list',
                    ['print', 'series-2-parallel-1-series-1'],
                    ['sleep', 5],
                    ['print', 'series-2-parallel-1-series-2'],],
                ['list',
                    ['print', 'series-2-parallel-2-series-1'],
                    ['sleep', 5],
                    ['print', 'series-2-parallel-2-series-2'],],],
        ],
        printVersion: ['list',
            ['time',
                ['list',
                    ['print', 'Running in sequence'],
                    ['list',
                        ['shell-command', 'node --version'],
                        ['shell-command', 'npm --version'],
                        ['shell-command', 'yarn --version']
                    ]
                ]
            ],
            ['time',
                ['list',
                    ['print', 'Running in parallel'],
                    ['plist',
                        ['shell-command', 'node --version'],
                        ['shell-command', 'npm --version'],
                        ['shell-command', 'yarn --version']
                    ]
                ]
            ],
        ]
    },
};
exports.default = exports.config;
//# sourceMappingURL=simple-parallel-tasks.js.map