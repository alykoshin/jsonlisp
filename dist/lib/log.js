"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log_data = void 0;
function log_data(data, prefix) {
    if (prefix === void 0) { prefix = ''; }
    data = data.toString();
    data.split(/\r?\n/).forEach(function (line) {
        var l = prefix
            ? "[".concat(prefix, "] ") + line
            : line + "\n";
        process.stdout.write(l + "\n");
    });
}
exports.log_data = log_data;
//# sourceMappingURL=log.js.map