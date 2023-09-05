"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action_rm = void 0;
const promises_1 = __importDefault(require("fs/promises"));
async function action_rm(definition, { id, fullConfig, runner }) {
    const dry = typeof definition.dry !== 'undefined' ? definition.dry : false;
    const files = Array.isArray(definition.files) ? definition.files : [definition.files];
    for (let pathname of files) {
        runner.debug(id, `[rm] deleting file "${pathname}"`);
        if (dry) {
            runner.debug(id, `[rm] "dry" flag is set; skipping`);
        }
        else {
            await promises_1.default.rm(pathname);
        }
    }
    runner.debug(id, `[cp] deleted ${files.length} dirs/files`);
}
exports.action_rm = action_rm;
//# sourceMappingURL=rm.js.map