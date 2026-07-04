/** @format */
/**
 * tools-runner / JL — public facade.
 *
 * Layers (see ARCHITECTURE.md):
 *   eval/    the evaluator (makeEvaluator, Environment, S-expression model)
 *   kernel/  the axiomatic kernel (7 primitives, lambda/defun, derived fns)
 *   cl/      standard vocabulary
 *   contrib/ host bindings
 */
export * from './eval';
export * from './kernel/booleans';
export { default as kernel } from './kernel';
export { default as cl } from './cl';
export { actions as defaultActions } from './actions';
export { Runner } from './apps/runner/runner';
export { Activities } from './apps/runner/startup/Activities';
export type { Activity } from './apps/runner/startup/Activities';
