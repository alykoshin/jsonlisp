/** @format */
/**
 * The meta-circular gate ("The Surprise", The Roots of Lisp §4):
 * McCarthy's eval. translated from jmc.lisp into JL, running on the JL
 * interpreter itself. If the kernel can run the paper's evaluator, the
 * kernel is complete and correctly wired (see ARCHITECTURE.md).
 *
 * Uses only: the seven primitives, defun/lambda, and the kernel's derived
 * functions (null_ and_ not_ append_ list_ pair_ assoc_). The c*r
 * compositions are defun'd here, as the paper assumes them from CL.
 *
 * Run:  ts-node ./src/cli.ts ./src/tests/kernel/jmc-eval.jl.ts
 */
import { Activity } from '../../toplevel/Activities';
export declare const config: Activity;
export default config;
