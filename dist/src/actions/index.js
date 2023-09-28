"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const build_1 = __importDefault(require("./build/"));
const lisp_like_1 = __importDefault(require("./lisp-like"));
const os_1 = __importDefault(require("./os/"));
exports.actions = {
    ...build_1.default,
    ...lisp_like_1.default,
    ...os_1.default,
};
exports.default = exports.actions;
//# sourceMappingURL=index.js.map