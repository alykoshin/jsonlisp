"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const conditionals_1 = __importDefault(require("./conditionals"));
const defines_1 = __importDefault(require("./defines"));
const documentation_1 = __importDefault(require("./documentation"));
const eval_1 = __importDefault(require("./core/eval"));
// import eval from './eval';
const file_system_1 = __importDefault(require("./file-system"));
const error_1 = __importDefault(require("./error"));
const input_output_1 = __importDefault(require("./input-output"));
const iteration_and_mapping_1 = __importDefault(require("./iteration-and-mapping"));
const lisp_unit_1 = __importDefault(require("./lisp-unit"));
const lists_1 = __importDefault(require("./lists"));
const operators_1 = __importDefault(require("./operators"));
const sb_posix_1 = __importDefault(require("./sb-posix"));
const simple_parallel_tasks_1 = __importDefault(require("./simple-parallel-tasks"));
const system_1 = __importDefault(require("./system"));
const trivial_shell_1 = __importDefault(require("./trivial-shell"));
exports.actions = {
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
};
exports.default = exports.actions;
//# sourceMappingURL=index.js.map