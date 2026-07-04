/** @format */
/**
 * Host assembly of the built-in vocabulary.
 * Spread order preserved from the pre-layers layout (later spreads win),
 * with two deliberate changes:
 * - the kernel (quote atom eq car cdr cons cond, lambda, defun) is now
 *   registered — the language tests always assumed it (see ARCHITECTURE.md);
 * - $sbcl is actually spread (it was imported and forgotten).
 */
import { Actions } from '../eval/sexpr';
export declare const actions: Actions;
export default actions;
