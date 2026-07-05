/** @format */
/**
 * Gate for the require-able vocabulary (ARCHITECTURE.md):
 * - this activity declares `requires`, so it gets core (cl/jmc/jl) plus
 *   ONLY the listed packages;
 * - sb-posix is required with {use: false}: qualified names only
 *   (sb-posix:getenv works, bare getenv does not exist);
 * - lisp-unit is required normally (bare assert-* available);
 * - trivial-shell is NOT required -> completely absent.
 */
import { Activity } from '../../apps/runner/startup/Activities';
export declare const config: Activity;
export default config;
