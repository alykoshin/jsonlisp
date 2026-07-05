"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.assemble = void 0;
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
/** Insertion order is the canonical assembly order (spread order). */
const REGISTRY = {
    // the COMMON-LISP package: kernel primitives + lambda/defun + eval + cl/
    cl: { pkg: 'cl', actions: { ...primitives_1.default, ...lambda_1.default, ...eval_1.default, ...cl_1.default } },
    // the paper's derived functions
    jmc: { pkg: 'jmc', actions: derived_1.default },
    // JL's own dialect extensions
    jl: { pkg: 'jl', actions: jl_1.default },
    //
    'sb-posix': { pkg: 'sb-posix', actions: sb_posix_1.default },
    //
    alexandria: { pkg: 'alexandria', actions: alexandria_1.default },
    str: { pkg: 'str', actions: str_1.default },
    'lisp-unit': { pkg: 'lisp-unit', actions: lisp_unit_1.default },
    'simple-parallel-tasks': {
        pkg: 'simple-parallel-tasks',
        actions: simple_parallel_tasks_1.default,
    },
    'trivial-shell': { pkg: 'trivial-shell', actions: trivial_shell_1.default },
    // host tooling ($-prefixed, never package-wrapped)
    build: { actions: build_1.default },
    os: { actions: os_1.default },
    axios: { actions: axios_1.default },
    'sbcl-bridge': { actions: sbcl_bridge_1.default },
};
/** Group names, à la (require :…) convenience. */
const GROUPS = {
    sbcl: ['sb-posix'],
    quicklisp: [
        'alexandria',
        'str',
        'lisp-unit',
        'simple-parallel-tasks',
        'trivial-shell',
    ],
    host: ['build', 'os', 'axios', 'sbcl-bridge'],
};
/** Always loaded — the language itself. */
const CORE = ['cl', 'jmc', 'jl'];
function assemble(requires) {
    const use = new Map();
    if (requires === undefined) {
        // no declaration -> full vocabulary, all packages "used"
        for (const name of Object.keys(REGISTRY))
            use.set(name, true);
    }
    else {
        for (const name of CORE)
            use.set(name, true);
        for (const r of requires) {
            const name = typeof r === 'string' ? r : r.name;
            const u = typeof r === 'string' ? true : r.use !== false;
            const members = GROUPS[name] ?? [name];
            for (const m of members) {
                if (!REGISTRY[m]) {
                    throw new Error(`Unknown vocabulary package "${m}" in requires ` +
                        `(known: ${[...Object.keys(REGISTRY), ...Object.keys(GROUPS)].join(', ')})`);
                }
                use.set(m, u);
            }
        }
    }
    const out = {};
    for (const [name, def] of Object.entries(REGISTRY)) {
        if (!use.has(name))
            continue;
        const acts = def.pkg
            ? (0, package_1.defpackage)(def.pkg, def.actions, { use: use.get(name) })
            : def.actions;
        Object.assign(out, acts);
    }
    return out;
}
exports.assemble = assemble;
/** The full default vocabulary (no `requires` declared). */
exports.actions = assemble();
exports.default = exports.actions;
//# sourceMappingURL=index.js.map