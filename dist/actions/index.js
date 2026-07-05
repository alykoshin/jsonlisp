"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const package_1 = require("../eval/package");
const eval_1 = __importDefault(require("../eval/eval"));
const primitives_1 = __importDefault(require("../kernel/primitives"));
const lambda_1 = __importDefault(require("../kernel/lambda"));
const derived_1 = __importDefault(require("../kernel/derived"));
const cl_1 = __importDefault(require("../cl"));
const jl_1 = __importDefault(require("../jl"));
const sb_posix_1 = __importDefault(require("../sbcl/sb-posix"));
const alexandria_1 = __importDefault(require("../quicklisp/alexandria"));
const str_1 = __importDefault(require("../quicklisp/str"));
const lisp_unit_1 = __importDefault(require("../quicklisp/lisp-unit"));
const simple_parallel_tasks_1 = __importDefault(require("../quicklisp/simple-parallel-tasks"));
const trivial_shell_1 = __importDefault(require("../quicklisp/trivial-shell"));
const sbcl_bridge_1 = __importDefault(require("../host/sbcl-bridge"));
const axios_1 = __importDefault(require("../host/axios"));
const build_1 = __importDefault(require("../host/build"));
const os_1 = __importDefault(require("../host/os"));
exports.actions = {
    // the COMMON-LISP package: kernel primitives + lambda/defun are CL
    // symbols, as are eval and everything in cl/
    ...(0, package_1.defpackage)('cl', { ...primitives_1.default, ...lambda_1.default, ...eval_1.default, ...cl_1.default }),
    // the paper's derived functions (null_ and_ not_ append_ list_ pair_ assoc_)
    ...(0, package_1.defpackage)('jmc', derived_1.default),
    // JL's own dialect extensions
    ...(0, package_1.defpackage)('jl', jl_1.default),
    //
    ...(0, package_1.defpackage)('sb-posix', sb_posix_1.default),
    //
    ...(0, package_1.defpackage)('alexandria', alexandria_1.default),
    ...(0, package_1.defpackage)('str', str_1.default),
    ...(0, package_1.defpackage)('lisp-unit', lisp_unit_1.default),
    ...(0, package_1.defpackage)('simple-parallel-tasks', simple_parallel_tasks_1.default),
    ...(0, package_1.defpackage)('trivial-shell', trivial_shell_1.default),
    //
    ...build_1.default,
    ...os_1.default,
    ...axios_1.default,
    ...sbcl_bridge_1.default,
};
exports.default = exports.actions;
//# sourceMappingURL=index.js.map