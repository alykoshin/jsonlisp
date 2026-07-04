/** @format */

/**
 * @module eval/conditions
 * [model] The error system (CL: conditions).
 * NB: named EvaluationError — plain "EvalError" collides with the JS built-in.
 */

import {Expression} from './sexpr';

export class EvaluationError extends Error {
  expression: Expression;
  constructor(expr: Expression, message?: string, options?: any) {
    const m = `Error during eval: ${message}`;
    super(m + ': "' + JSON.stringify(expr) + '"', options);
    this.expression = expr;
  }
}

/** Historical name. */
export {EvaluationError as EEvalError};
