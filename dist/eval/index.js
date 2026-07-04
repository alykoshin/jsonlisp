"use strict";
/** @format */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEvaluator = exports.evaluateListList = exports.execFunction = exports.execNamedAction = exports.eval_ = void 0;
const environment_1 = require("./environment");
const eval_1 = require("./eval");
__exportStar(require("./sexpr"), exports);
__exportStar(require("./evlis"), exports);
__exportStar(require("./validate-args"), exports);
__exportStar(require("./environment"), exports);
__exportStar(require("./tracer"), exports);
__exportStar(require("./conditions"), exports);
var eval_2 = require("./eval");
Object.defineProperty(exports, "eval_", { enumerable: true, get: function () { return eval_2.eval_; } });
var apply_1 = require("./apply");
Object.defineProperty(exports, "execNamedAction", { enumerable: true, get: function () { return apply_1.execNamedAction; } });
Object.defineProperty(exports, "execFunction", { enumerable: true, get: function () { return apply_1.execFunction; } });
Object.defineProperty(exports, "evaluateListList", { enumerable: true, get: function () { return apply_1.evaluateListList; } });
/** CL's make-* constructor convention. */
function makeEvaluator(opts) {
    return new environment_1.Environment({ ...opts, evalFn: eval_1.eval_ });
}
exports.makeEvaluator = makeEvaluator;
//# sourceMappingURL=index.js.map