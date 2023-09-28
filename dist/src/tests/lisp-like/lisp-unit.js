"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    base_dir: './demo',
    version: '2.5.22',
    actions: {
        default: [
            'list',
            ['print', 'This will test operators'],
            ['assert-true', true],
            ['assert-true', false],
            ['assert-false', true],
            ['assert-false', false],
            ['assert-equal', 1, 1],
            ['assert-equal', 1, 2],
            ['assert-equal', 'aaa', 'aaa'],
            ['assert-equal', 'aaa', 'bbb'],
        ],
    },
};
exports.default = exports.config;
//# sourceMappingURL=lisp-unit.js.map