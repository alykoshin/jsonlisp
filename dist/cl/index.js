"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const conses_1 = __importDefault(require("./conses")); // ch 14
const conditions_1 = __importDefault(require("./conditions")); // ch 9
const data_and_control_flow_1 = __importDefault(require("./data-and-control-flow")); // ch 5
const environment_1 = __importDefault(require("./environment")); // ch 25
const files_1 = __importDefault(require("./files")); // ch 20
const numbers_1 = __importDefault(require("./numbers")); // ch 12
const printer_1 = __importDefault(require("./printer")); // ch 21/22
const sequences_1 = __importDefault(require("./sequences")); // ch 17
exports.actions = {
    ...conses_1.default,
    ...conditions_1.default,
    ...data_and_control_flow_1.default,
    ...environment_1.default,
    ...files_1.default,
    ...numbers_1.default,
    ...printer_1.default,
    ...sequences_1.default,
};
exports.default = exports.actions;
//# sourceMappingURL=index.js.map