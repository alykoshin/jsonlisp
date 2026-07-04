/** @format */
/**
 * @module eval/conditions
 * [model] The error system (CL: conditions).
 * NB: named EvaluationError — plain "EvalError" collides with the JS built-in.
 */
import { Expression } from './sexpr';
export declare class EvaluationError extends Error {
    expression: Expression;
    constructor(expr: Expression, message?: string, options?: any);
}
/** Historical name. */
export { EvaluationError as EEvalError };
