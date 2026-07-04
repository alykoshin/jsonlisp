"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EEvalError = exports.EvaluationError = void 0;
class EvaluationError extends Error {
    expression;
    constructor(expr, message, options) {
        const m = `Error during eval: ${message}`;
        super(m + ': "' + JSON.stringify(expr) + '"', options);
        this.expression = expr;
    }
}
exports.EvaluationError = EvaluationError;
exports.EEvalError = EvaluationError;
//# sourceMappingURL=conditions.js.map