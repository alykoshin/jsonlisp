"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const conditionals_1 = __importDefault(require("./conditionals"));
const defining_variables_and_functions_1 = __importDefault(require("./defining-variables-and-functions"));
const error_1 = __importDefault(require("./error"));
const list_functions_1 = __importDefault(require("./list-functions"));
const operators_1 = __importDefault(require("./operators"));
exports.actions = {
    ...conditionals_1.default,
    ...defining_variables_and_functions_1.default,
    ...error_1.default,
    ...operators_1.default,
    ...list_functions_1.default,
};
exports.default = exports.actions;
//# sourceMappingURL=index.js.map