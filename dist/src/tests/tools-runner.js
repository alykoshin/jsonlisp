"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activity = void 0;
const actions = {
    default: [
        // 'testTemplate',
        // 'printNpmVersion'
        'test$expect'
    ],
    testTemplate: ['$echo', 'This output is based on template and scope: { test: "${test}" }'],
    test$expect: [
        '$series',
        ['$expect', 1, 1],
        ['$expect', 22, 33],
    ],
    printVersion: ['when',
        ['$confirm', 'Continue Y/[N]?'],
        ['time',
            ['$exec',
                'node --version',
                'npm  --version',
                'yarn --version']]],
    test: ['$series',
        ['$echo', 'series-1'],
        ['$parallel',
            ['$series',
                ['$echo', 'series-2-parallel-1-series-1'],
                ['sleep', ['+', 0.1, 0.2, 0.7]],
                ['$echo', 'series-2-parallel-1-series-2']],
            ['$series',
                ['echo', 'series-2-parallel-2-series-1'],
                ['sleep', ['*', 1, 1, 1]],
                ['echo', 'series-2-parallel-2-series-2']],
        ],
        ['$exec', 'cmd /c echo "exec \"cmd /c echo\""'],
        ['when',
            true, [
                '$echo', '"when" evaluated to true'
            ]],
        ['$echo',
            ['+',
                1, 2, 3]],
        ['$echo',
            ['-',
                100, 10, 1]],
        ['$echo',
            'series-4'],
        ['time',
            ['$echo', 'echo time']]],
    _execute: ['$series',
        ['$echo', 'series-1'],
        ['$parallel',
            ['$series',
                ['$echo', 'series-2-parallel-1-series-1'],
                ['sleep', 500],
                ['$echo', 'series-2-parallel-1-series-2'],],
            ['$series',
                ['$echo', 'series-2-parallel-2-series-1'],
                ['sleep', 500],
                ['$echo', 'series-2-parallel-2-series-2'],],],
        ['$echo', 'series-3'],
        ['$echo', 'series-4'],],
    queryClean: ['$series',
        ["$echo", "Ensuring Git directory is clean..."],
        ["$exec", "git status --untracked-files=no --porcelain"]],
};
exports.activity = {
    base_dir: './demo',
    version: '2.5.22',
    actions: {
        default: ['test$expect'],
        ...actions,
    }
};
exports.default = exports.activity;
//# sourceMappingURL=tools-runner.js.map