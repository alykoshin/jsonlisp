/** @format */

/**
 * @module kernel/derived
 * The derived functions of The Roots of Lisp §3 ("Some Functions") — SICP's
 * term: "derived expressions". The definitions live IN JL ITSELF, in
 * `derived.jl.jsonc` — a JL program (a top-level array of defun forms)
 * mirroring jmc.lisp one-to-one under the paper's own names:
 *
 *   null. and. not. append. list. pair. assoc.
 *
 * This module cold-loads it through the REAL evaluator over the kernel's
 * own vocabulary (primitives + lambda/defun) — SBCL loading its Lisp-written
 * library (compare src/code/*.lisp there); see kernel/load. Loading is
 * therefore async: the vocabulary is BUILT, not a module-load-time constant
 * (awaited once by modules/assemble, cached here).
 * The `_`-suffixed spellings (null_ …) are registered as aliases; they were
 * the transliteration of the paper's dot back when these lived in TS
 * (`.` is illegal in JS identifiers — JSON keys have no such limit).
 *
 * Together with the seven primitives and lambda/defun these are exactly the
 * vocabulary the paper needs to write eval. — see the meta-circular test
 * activity (src/tests/kernel/jmc-eval.jl.jsonc).
 */

import path from 'path';

import { Actions } from '../eval/sexpr';
import { coldLoadJlProgram } from './load';
import primitives from './primitives';
import lambda from './lambda';

// resolves from src/kernel (ts-node) and dist/kernel alike — the build
// activity copies the .jl.jsonc next to the compiled module (copy-jl-sources)
const SOURCE = path.join(__dirname, 'derived.jl.jsonc');

let cached: Promise<Actions> | undefined;

export function loadDerived(): Promise<Actions> {
  if (!cached) {
    cached = coldLoadJlProgram(SOURCE, { ...primitives, ...lambda }).then((actions) => {
      // aliases: the historical underscore spellings (null. -> null_)
      for (const [name, def] of Object.entries(actions)) {
        actions[name.replace(/\.$/, '_')] = def;
      }
      return actions;
    });
  }
  return cached;
}

export default loadDerived;
