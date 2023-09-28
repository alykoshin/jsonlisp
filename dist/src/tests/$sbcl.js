"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const _sbcl_1 = __importDefault(require("../actions/$sbcl/"));
exports.config = {
    base_dir: './demo',
    version: '2.5.22',
    actions: {
        ..._sbcl_1.default,
        default: ['list',
            ['print', 'Testing sbcl'],
            // ['assert-equal', 1, [ "$sbcl-to-list", '1']],
            // ['assert-equal', -1000, [ "$sbcl-to-list", '-1000']],
            // 
            // Parse strings
            // ['assert-equal', true, [ "$parse-sbcl-list", 'T']],
            // ['assert-equal', false, [ "$parse-sbcl-list", 'NIL']],
            // Run SBCL and parse its actual output
            // ['assert-equal', true, [ "$sbcl-to-list", 'T']],
            // ['assert-equal', false, [ "$sbcl-to-list", 'NIL']],
            // Parse strings
            ['assert-equal', ['list', 1, 22, 333], ["$parse-sbcl-list", '(1 22 333)']],
            ['assert-equal',
                ['list',
                    "\"test\"", 1, 22, 333],
                ["$parse-sbcl-list",
                    '("test"    1  22  333)']],
            // Run SBCL and parse its actual output
            // ['assert-equal', true, [ "$sbcl-to-list", 'T']],
            // ['assert-equal', false, [ "$sbcl-to-list", 'NIL']],
            // ['assert-equal', 1, [ "$sbcl-to-list", '1']],
            // ['assert-equal', [ 'list' ], [ "$sbcl-to-list", '( list )']],
            // ['assert-equal', [ 'list', 1, 22, 333 ], [ "$sbcl-to-list", '(list 1 22 333)']],
            // ['assert-equal', [ 'list', 1, 22, ['list', 333] ], [ "$sbcl-to-list", '(list 1 22 (list 333))']],
        ]
    },
};
exports.default = exports.config;
//# sourceMappingURL=$sbcl.js.map