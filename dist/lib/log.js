"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log_data = void 0;
var chalk_1 = __importDefault(require("chalk"));
function log_data(data, prefix) {
    if (prefix === void 0) { prefix = ''; }
    data = data.toString();
    data
        .split(/\r?\n/)
        .forEach(function (line) {
        var l = typeof prefix !== 'undefined'
            ? chalk_1.default.grey("[".concat(prefix, "] ")) + line
            : line;
        process.stdout.write(l + "\n");
    });
}
exports.log_data = log_data;
//# sourceMappingURL=log.js.map