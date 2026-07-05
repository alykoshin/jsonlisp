"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.length = void 0;
const validate_args_1 = require("../eval/validate-args");
const sexpr_1 = require("../eval/sexpr");
/**
 * @module cl/sequences
 * CLHS chapter 17 "Sequences".
 * (`concatenate` is documented in old notes but was never implemented.)
 */
/** @name length */
const length = async (_, args, st) => {
    (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
    const a0 = await st.evaluate(args[0]);
    (0, sexpr_1.ensureList)(a0);
    return a0.length;
};
exports.length = length;
exports.actions = {
    length: exports.length,
};
exports.default = exports.actions;
//# sourceMappingURL=sequences.js.map