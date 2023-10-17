"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const compile_pegjs_1 = require("./lib/compile-pegjs");
async function run() {
    const base_path = './resources/downloads/';
    const grammarPathname = path_1.default.resolve(__dirname, './grammar/lisp.pegjs');
    await (0, compile_pegjs_1.compileFileDir)(base_path, grammarPathname);
}
run();
//# sourceMappingURL=cl2jl.js.map