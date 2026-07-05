"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// prettier-ignore
exports.config = {
    base_dir: '.',
    version: '0.0.0',
    actions: {
        // NB: this is a DEMO of the lisp-unit assertions — half of these
        // asserts fail BY DESIGN to show failure reporting. Do not include in
        // green-gate test runs (scripts/run-jl-tests.js).
        default: [
            'list',
            ['print', 'This will test lisp-unit assertions (4 fail by design)'],
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