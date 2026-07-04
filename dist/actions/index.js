"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const sbcl_1 = __importDefault(require("../contrib/sbcl"));
const axios_1 = __importDefault(require("../contrib/axios"));
const build_1 = __importDefault(require("../contrib/build"));
const os_1 = __importDefault(require("../contrib/os"));
const eval_1 = __importDefault(require("../eval/eval"));
const kernel_1 = __importDefault(require("../kernel"));
const conditionals_1 = __importDefault(require("../cl/conditionals"));
const defines_1 = __importDefault(require("../cl/defines"));
const documentation_1 = __importDefault(require("../cl/documentation"));
const error_1 = __importDefault(require("../cl/error"));
const input_output_1 = __importDefault(require("../cl/input-output"));
const iteration_and_mapping_1 = __importDefault(require("../cl/iteration-and-mapping"));
const lists_1 = __importDefault(require("../cl/lists"));
const operators_1 = __importDefault(require("../cl/operators"));
const system_1 = __importDefault(require("../cl/system"));
const file_system_1 = __importDefault(require("../contrib/file-system"));
const lisp_unit_1 = __importDefault(require("../contrib/lisp-unit"));
const sb_posix_1 = __importDefault(require("../contrib/sb-posix"));
const simple_parallel_tasks_1 = __importDefault(require("../contrib/simple-parallel-tasks"));
const trivial_shell_1 = __importDefault(require("../contrib/trivial-shell"));
exports.actions = {
    ...build_1.default,
    // the axiomatic kernel first — cl modules may consciously extend it:
    ...kernel_1.default,
    // former lisp-like merge, original order:
    ...conditionals_1.default,
    ...defines_1.default,
    ...documentation_1.default,
    ...eval_1.default,
    ...error_1.default,
    ...file_system_1.default,
    ...input_output_1.default,
    ...iteration_and_mapping_1.default,
    ...lisp_unit_1.default,
    ...lists_1.default,
    ...operators_1.default,
    ...sb_posix_1.default,
    ...simple_parallel_tasks_1.default,
    ...system_1.default,
    ...trivial_shell_1.default,
    //
    ...os_1.default,
    ...axios_1.default,
    ...sbcl_1.default,
};
exports.default = exports.actions;
//# sourceMappingURL=index.js.map