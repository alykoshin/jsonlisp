"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action_cp = void 0;
const promises_1 = __importDefault(require("fs/promises"));
async function action_cp(definition, { id, fullConfig, runner }) {
    const sources = Array.isArray(definition.source) ? definition.source : [definition.source];
    for (let src of sources) {
        runner.debug(id, `[cp] copying "${src}"`);
        if (definition.dry) {
            runner.debug(id, `[rm] "dry" flag is set; skipping`);
        }
        else {
            await promises_1.default.cp(src, definition.dest);
        }
    }
    runner.debug(id, `[cp] copied ${sources.length} dirs/files`);
}
exports.action_cp = action_cp;
async function copyBuildPkg() {
}
//# sourceMappingURL=cp.js.map