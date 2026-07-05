/** @format */
/**
 * @module eval
 * The evaluator's public facade.
 *
 * Two faces (see ARCHITECTURE.md):
 * - for action authors: the S-expression model, guards, evlis, validate-args,
 *   and the Environment surface;
 * - for hosts: makeEvaluator() — the composition point that injects the
 *   dispatcher into the environment.
 */
import { Scopes } from '@utilities/object';
import { ErrorLevel, Logger } from '../lib/log';
import { Actions, Atom } from './sexpr';
import { Environment } from './environment';
import { Tracer } from './tracer';
export * from './sexpr';
export * from './evlis';
export * from './validate-args';
export * from './environment';
export * from './tracer';
export * from './conditions';
export * from './package';
export { eval_ } from './eval';
export { execNamedAction, execFunction, evaluateListList } from './apply';
export interface MakeEvaluatorOptions {
    actions: Actions;
    scopes?: Scopes<Atom>;
    logger?: Logger;
    errorLevel?: ErrorLevel;
    tracer?: Tracer;
}
/** CL's make-* constructor convention. */
export declare function makeEvaluator(opts: MakeEvaluatorOptions): Environment;
