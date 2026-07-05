"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
/**
 * @module kernel/derived
 * The derived functions of The Roots of Lisp §3 ("Some Functions") — SICP's
 * term: "derived expressions". The definitions live IN JL ITSELF, in
 * `derived.jl.jsonc`, mirroring jmc.lisp one-to-one under the paper's own
 * names:
 *
 *   null. and. not. append. list. pair. assoc.
 *
 * This module only loads and compiles them — SBCL's cold boot: the host
 * processes Lisp sources to build the image (compare src/code/*.lisp there).
 * The `_`-suffixed spellings (null_ …) are registered as aliases; they were
 * the transliteration of the paper's dot back when these lived in TS
 * (`.` is illegal in JS identifiers — JSON keys have no such limit).
 *
 * Together with the seven primitives and lambda/defun these are exactly the
 * vocabulary the paper needs to write eval. — see the meta-circular test
 * activity (src/tests/kernel/jmc-eval.jl.jsonc).
 */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const json5_1 = __importDefault(require("json5"));
const lambda_1 = require("./lambda");
// resolves from src/kernel (ts-node) and dist/kernel alike — the build
// activity copies the .jl.jsonc next to the compiled module (copy-jl-sources)
const SOURCE = path_1.default.join(__dirname, 'derived.jl.jsonc');
const definitions = json5_1.default.parse(fs_1.default.readFileSync(SOURCE, 'utf8'));
exports.actions = (0, lambda_1.compileLambdaActions)(definitions, SOURCE);
// aliases: the historical underscore spellings (null. -> null_)
for (const [name, def] of Object.entries(exports.actions)) {
    exports.actions[name.replace(/\.$/, '_')] = def;
}
exports.default = exports.actions;
//# sourceMappingURL=derived.js.map