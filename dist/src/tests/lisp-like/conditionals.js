"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const _sbcl_1 = __importDefault(require("../../actions/$sbcl/"));
exports.config = {
    base_dir: './demo',
    version: '2.5.22',
    actions: {
        ..._sbcl_1.default,
        default: ['$series',
            ['test_cond'],
        ],
        "test_cond": ['$series',
            ['$expect',
                ["cond",
                    [true, ["list", 10], 11],
                    [true, ["list", 20]]],
                ["$sbcl-to-list", [
                        '(cond',
                        '(T 10 11 )',
                        '(T 20 )',
                        ')'
                    ].join(' ')
                ]
            ],
        ]
    },
};
exports.default = exports.config;
//# sourceMappingURL=conditionals.js.map