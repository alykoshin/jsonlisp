"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// prettier-ignore
exports.config = {
    base_dir: '.',
    version: '0.0.0',
    actions: {
        default: ['print', 'Any of the tests here will immediately exit the process, so they are not default'],
        errorUserMsg: ['error', 'This is the error message'],
        errorDefaultMsg: ['error', 'This is the error message'],
    },
};
exports.default = exports.config;
//# sourceMappingURL=error.js.map