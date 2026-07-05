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
import { Actions } from './sexpr';
export declare function defpackage(pkg: string, actions: Actions, opts?: {
    use?: boolean;
}): Actions;
