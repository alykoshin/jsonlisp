"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const defining_variables_and_functions_1 = __importDefault(require("./defining-variables-and-functions"));
const operators_1 = __importDefault(require("./operators"));
const error_1 = __importDefault(require("./error"));
const when_1 = require("./when");
exports.actions = {
    ...defining_variables_and_functions_1.default,
    ...error_1.default,
    ...operators_1.default,
    when: when_1.when,
};
exports.default = exports.actions;
//# sourceMappingURL=index.js.map