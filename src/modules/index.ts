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
 * Vocabulary is REQUIRE-able, like SBCL contribs. An activity may declare
 *
 *   requires: ['sb-posix', {name: 'trivial-shell', use: false}, 'host']
 *
 * and gets the core language (cl + jmc + jl) plus exactly those packages.
 * `use: false` registers qualified names ONLY (sb-posix:getenv but no bare
 * getenv) — CL's "don't use-package" discipline. Group names expand:
 * sbcl, quicklisp, host. No `requires` declared -> the full vocabulary
 * (backward compatible).
 */

import {Actions} from '../eval/sexpr';
import {defpackage} from '../eval/package';

import eval_ from '../eval/eval';
import primitives from '../kernel/primitives';
import lambda from '../kernel/lambda';
import derived from '../kernel/derived';
import cl from '../cl';
import jl from '../jl';

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

/** Insertion order is the canonical assembly order (spread order). */
const REGISTRY: Record<string, PackageDef> = {
  // the COMMON-LISP package: kernel primitives + lambda/defun + eval + cl/
  cl: {pkg: 'cl', actions: {...primitives, ...lambda, ...eval_, ...cl}},
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

/** Group names, à la (require :…) convenience. */
const GROUPS: Record<string, string[]> = {
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

export type Require = string | {name: string; use?: boolean};

export function assemble(requires?: Require[]): Actions {
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
export const actions: Actions = assemble();

export default actions;
