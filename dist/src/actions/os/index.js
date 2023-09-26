"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const _confirm_1 = __importDefault(require("./$confirm"));
const _cwd_1 = __importDefault(require("./$cwd"));
const _shelljs_1 = __importDefault(require("./$shelljs"));
exports.actions = {
    ..._confirm_1.default,
    ..._cwd_1.default,
    ..._shelljs_1.default,
};
exports.default = exports.actions;
//# sourceMappingURL=index.js.map