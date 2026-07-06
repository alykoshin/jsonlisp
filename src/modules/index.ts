/** @format */

/**
 * Host assembly of the vocabulary, organized by origin (see ARCHITECTURE.md):
 *   kernel     — the axiomatic kernel
 *   cl/        — ANSI COMMON-LISP (modules = CLHS chapters)
 *   sbcl/      — SBCL packages we emulate (sb-posix)
 *   quicklisp/ — third-party CL systems (trivial-shell, lisp-unit, …)
 *   jl/        — JL's own dialect extensions
 *   host/      — non-Lisp, $-marked npm/host tooling
 *
 * The always-loaded core is the LANGUAGE, not the library — R7RS's
 * `(scheme base)` vs the optional `(scheme file)`/`(scheme char)` libraries,
 * or Emacs Lisp's small core with CL-ness opt-in via `(require 'cl-lib)`.
 * Ring structure:
 *
 *   ring 0  kernel        the paper's seven primitives + lambda/defun (jmc)
 *   ring 1  cl-core       evaluator machinery + glue every activity needs:
 *                         control flow (CLHS ch 5 entire), print/princ,
 *                         error/assert, list, arithmetic/comparisons
 *   ring 2  cl-*          the remaining CLHS chapters — require-able,
 *                         like any contrib; group 'cl' loads them all
 *   ring 3  sbcl/quicklisp/host — unchanged contribs
 *
 * NB this is deliberately un-ANSI (a conforming CL always has the whole
 * COMMON-LISP package); JL trades that for a small stable tool core.
 * The SBCL referee harness therefore always runs with the full vocabulary.
 *
 * Vocabulary is REQUIRE-able, like SBCL contribs. An activity may declare
 *
 *   requires: ['sb-posix', {name: 'trivial-shell', use: false}, 'cl-files']
 *
 * and gets the core language (cl-core + jmc + jl) plus exactly those
 * packages. `use: false` registers qualified names ONLY (sb-posix:getenv
 * but no bare getenv) — CL's "don't use-package" discipline. Group names
 * expand: cl, sbcl, quicklisp, host. No `requires` declared -> the full
 * vocabulary (backward compatible).
 */

import {Actions} from '../eval/sexpr';
import {defpackage} from '../eval/package';

import eval_ from '../eval/eval';
import primitives from '../kernel/primitives';
import lambda from '../kernel/lambda';
import {loadDerived} from '../kernel/derived';
import jl from '../jl';

// CLHS chapters imported individually: cl-core cherry-picks glue from them,
// the rest stay require-able (modules/ sits above the layers — see
// scripts/check-layers.js)
import conses from '../cl/conses';
import conditions from '../cl/conditions';
import dataAndControlFlow from '../cl/data-and-control-flow';
import environment from '../cl/environment';
import files from '../cl/files';
import numbers from '../cl/numbers';
import printer from '../cl/printer';
import sequences from '../cl/sequences';
import systemConstruction from '../cl/system-construction';

import sbPosix from '../sbcl/sb-posix';

import alexandria from '../quicklisp/alexandria';
import str from '../quicklisp/str';
import lispUnit from '../quicklisp/lisp-unit';
import simpleParallelTasks from '../quicklisp/simple-parallel-tasks';
import trivialShell from '../quicklisp/trivial-shell';

import $sbclBridge from '../host/sbcl-bridge';
import $axios from '../host/axios';
import buildActions from '../host/build';
import osActions from '../host/os';

/** A loadable vocabulary unit; pkg present => wrapped with defpackage. */
interface PackageDef {
  pkg?: string;
  actions: Actions;
}

/** Subset of an actions map by name; throws on drift (renamed/removed). */
function pick(actions: Actions, names: string[]): Actions {
  const out: Actions = {};
  for (const n of names) {
    if (!(n in actions)) {
      throw new Error(`pick: action "${n}" not found in source module`);
    }
    out[n] = actions[n];
  }
  return out;
}

/**
 * The glue cherry-picked from chapters into cl-core — chosen by evidence:
 * what real activities (tools/jsonlisp.jl.jsonc, local-projects) and the
 * requires-declaring tests actually call. R7RS-small does the same cut:
 * `(scheme base)` holds SOME pairs/arithmetic/io, the rest is libraries.
 */
const GLUE = {
  conses: ['list'],
  printer: ['print', 'princ'],
  numbers: [
    '+', '-', '*', '/', '1+', '1-',
    '=', '/=', '>', '<', '>=', '<=',
    'min', 'max', 'mod', 'rem',
  ],
  // ch 5 (data-and-control-flow) and ch 9 (conditions: error/assert) are
  // absorbed whole — control flow and signaling ARE the language
};

/**
 * Insertion order is the canonical assembly order (spread order).
 * Built lazily: the jmc entry is COLD-LOADED (derived.jl.jsonc runs through
 * the real evaluator — see kernel/load), so the image is the product of an
 * async boot, not a module-load-time constant — SBCL's cold-init, not a
 * static initializer.
 */
function buildRegistry(derived: Actions): Record<string, PackageDef> {
  return {
    // ring 1 — the COMMON-LISP package's language core: kernel primitives,
    // lambda/defun, eval, control flow, signaling, glue picks
    'cl-core': {
      pkg: 'cl',
      actions: {
        ...primitives,
        ...lambda,
        ...eval_,
        ...dataAndControlFlow,
        ...conditions,
        ...pick(conses, GLUE.conses),
        ...pick(printer, GLUE.printer),
        ...pick(numbers, GLUE.numbers),
      },
    },
    // ring 2 — the remaining CLHS chapters, each a complete package
    // (overlap with cl-core picks is idempotent: same defs, same names)
    'cl-conses': {pkg: 'cl', actions: conses},
    'cl-environment': {pkg: 'cl', actions: environment},
    'cl-files': {pkg: 'cl', actions: files},
    'cl-numbers': {pkg: 'cl', actions: numbers},
    'cl-printer': {pkg: 'cl', actions: printer},
    'cl-sequences': {pkg: 'cl', actions: sequences},
    'cl-system-construction': {pkg: 'cl', actions: systemConstruction},
    // the paper's derived functions
    jmc: {pkg: 'jmc', actions: derived},
    // JL's own dialect extensions
    jl: {pkg: 'jl', actions: jl},
    //
    'sb-posix': {pkg: 'sb-posix', actions: sbPosix},
    //
    alexandria: {pkg: 'alexandria', actions: alexandria},
    str: {pkg: 'str', actions: str},
    'lisp-unit': {pkg: 'lisp-unit', actions: lispUnit},
    'simple-parallel-tasks': {
      pkg: 'simple-parallel-tasks',
      actions: simpleParallelTasks,
    },
    'trivial-shell': {pkg: 'trivial-shell', actions: trivialShell},
    // host tooling ($-prefixed, never package-wrapped)
    build: {actions: buildActions},
    os: {actions: osActions},
    axios: {actions: $axios},
    'sbcl-bridge': {actions: $sbclBridge},
  };
}

let _registry: Record<string, PackageDef> | undefined;

async function registry(): Promise<Record<string, PackageDef>> {
  if (!_registry) _registry = buildRegistry(await loadDerived());
  return _registry;
}

/** Group names, à la (require :…) convenience. */
const GROUPS: Record<string, string[]> = {
  // requires: ['cl'] = the full ANSI surface, i.e. today's pre-split 'cl'
  cl: [
    'cl-conses',
    'cl-environment',
    'cl-files',
    'cl-numbers',
    'cl-printer',
    'cl-sequences',
    'cl-system-construction',
  ],
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

/** Always loaded — the language itself (never the library). */
const CORE = ['cl-core', 'jmc', 'jl'];

export type Require = string | {name: string; use?: boolean};

export async function assemble(requires?: Require[]): Promise<Actions> {
  const REGISTRY = await registry();
  const use = new Map<string, boolean>();

  if (requires === undefined) {
    // no declaration -> full vocabulary, all packages "used"
    for (const name of Object.keys(REGISTRY)) use.set(name, true);
  } else {
    for (const name of CORE) use.set(name, true);
    for (const r of requires) {
      const name = typeof r === 'string' ? r : r.name;
      const u = typeof r === 'string' ? true : r.use !== false;
      const members = GROUPS[name] ?? [name];
      for (const m of members) {
        if (!REGISTRY[m]) {
          throw new Error(
            `Unknown vocabulary package "${m}" in requires ` +
              `(known: ${[...Object.keys(REGISTRY), ...Object.keys(GROUPS)].join(', ')})`
          );
        }
        use.set(m, u);
      }
    }
  }

  const out: Actions = {};
  for (const [name, def] of Object.entries(REGISTRY)) {
    if (!use.has(name)) continue;
    const acts = def.pkg
      ? defpackage(def.pkg, def.actions, {use: use.get(name)})
      : def.actions;
    Object.assign(out, acts);
  }
  return out;
}

/** The full default vocabulary (no `requires` declared). */
export function defaultActions(): Promise<Actions> {
  return assemble();
}

export default defaultActions;
