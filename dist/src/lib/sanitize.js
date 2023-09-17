"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeArray = void 0;
const sanitizeArray = (array, defaultValue) => {
    if (!array)
        array = defaultValue || [];
    if (!Array.isArray(array))
        array = [array];
    return array;
};
exports.sanitizeArray = sanitizeArray;
//# sourceMappingURL=sanitize.js.map