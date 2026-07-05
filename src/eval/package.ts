/** @format */

/**
 * @module eval/package
 * [model] A one-function emulation of the CL package system.
 *
 * `defpackage(pkg, actions)` returns a map with every action registered
 * under its qualified name `pkg:name` AND its bare name — the bare aliases
 * model CL's use-package (all packages are "used" by default, as CL programs
 * usually (use-package :cl) etc.). Qualified names are collision-free by
 * construction; bare-name collisions keep today's last-spread-wins rule.
 *
 * Pass {use: false} to register qualified names only.
 */

import {Actions, ExecutorFn} from './sexpr';

export function defpackage(
  pkg: string,
  actions: Actions,
  opts: {use?: boolean} = {}
): Actions {
  const out: Actions = {};
  for (const [name, def] of Object.entries(actions)) {
    // `pkg:sym` names the same symbol as `sym` — executors that dispatch on
    // their invoked name (e.g. the cl/numbers operators family) must receive
    // the bare symbol name, not the qualified spelling.
    out[`${pkg}:${name}`] =
      typeof def === 'function'
        ? (((_, args, st) => (def as ExecutorFn)(name, args, st)) as ExecutorFn)
        : def;
    if (opts.use !== false) out[name] = def;
  }
  return out;
}
