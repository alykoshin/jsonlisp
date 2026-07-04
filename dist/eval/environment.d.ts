/** @format */
/**
 * @module eval/environment
 * [model] The evaluation environment. JL is a Lisp-2: `actions` is the
 * function namespace, `scopes` the value namespace (see ARCHITECTURE.md,
 * divergence 3).
 *
 * The evaluator is injected (`evalFn`) rather than imported — the same shape
 * that lets SBCL swap sb-eval/sb-fasteval behind one interface. Wire it with
 * makeEvaluator() from eval/index.
 */
import { EvaluateFn, ExecutorFn, Actions, Atom, Expression, Parameter } from './sexpr';
import { Scopes } from '@utilities/object';
import { ErrorLevel, Logger } from '../lib/log';
import type { Tracer } from './tracer';
export type { ILoggerState } from '../lib/log';
import type { ILoggerState } from '../lib/log';
interface IEnvironmentInit {
    id?: number;
    level?: number;
    name?: string;
    names?: string[];
    actions: Actions;
    evalFn?: ExecutorFn;
    tracer?: Tracer;
    scopes?: Scopes<Atom>;
    logger?: Logger;
    errorLevel?: ErrorLevel;
}
export interface IState extends IEnvironmentInit {
    id: number;
    evaluate: EvaluateFn;
}
export declare class Environment implements IState, ILoggerState {
    id: number;
    level: number;
    names: string[];
    scopes: Scopes<Atom>;
    actions: Actions;
    evalFn: ExecutorFn;
    tracer?: Tracer;
    logger: Logger;
    constructor(init: IEnvironmentInit);
    evaluate(expr: Expression): Promise<Parameter>;
    new(): Environment;
    next(): Environment;
    up(name: string): Environment;
    newNextUp(name: string): Environment;
}
/** Historical name — every action signature uses it. */
export { Environment as State };
