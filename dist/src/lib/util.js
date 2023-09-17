"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fn_check_params = void 0;
const fn_check_params = (parameters, { exactCount, minCount }) => {
    if (!parameters)
        throw new Error('Parameters must be provided');
    if (!Array.isArray(parameters))
        throw new Error('Parameters must be an array');
    const len = parameters.length;
    if ((typeof exactCount === 'number' && len !== exactCount) ||
        (Array.isArray(exactCount) && exactCount.indexOf(len) < 0))
        throw new Error(`Invalid number of parameters, expected exactly ${exactCount}, found: ${len}`);
    if (typeof minCount !== 'undefined' && len < minCount)
        throw new Error(`Invalid number of parameters, expected at least ${minCount}, found: ${len}`);
};
exports.fn_check_params = fn_check_params;
//# sourceMappingURL=util.js.map