"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const _series_1 = __importDefault(require("./$series"));
const _parallel_1 = __importDefault(require("./$parallel"));
exports.actions = {
    ..._parallel_1.default,
    ..._series_1.default,
};
exports.default = exports.actions;
//# sourceMappingURL=index.js.map