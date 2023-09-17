"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.log_data = void 0;
const chalk_1 = __importDefault(require("chalk"));
/*
debug(...args: any[]) {
  if (DEFAULT_DEBUG) {
    const prefix = stringUtils.repeat('*', this._level);
    console.debug(`${prefix} [${this._steps}/${this._level}]`, ...args);
  }
}
*/
function log_data(data, prefix = '') {
    data = data.toString();
    data
        .split(/\r?\n/)
        .forEach(line => {
        const l = typeof prefix !== 'undefined'
            ? chalk_1.default.grey(`[${prefix}] `) + line
            : line;
        process.stdout.write(l + "\n");
    });
}
exports.log_data = log_data;
function debugPrimitive(value) {
    let result = String(value);
    if (typeof value === 'string')
        result = `"${result}"`;
    return result;
}
class Logger {
    _prefix;
    constructor(prefix) {
        this._prefix = prefix;
        // this.prefix(prefix);
    }
    prefix(prefix) {
        this._prefix = prefix;
    }
    new(prefix) {
        return new Logger({ ...this._prefix, ...prefix });
    }
    _prefixToString(prefix) {
        return `${this._prefix.level}/${this._prefix.id}`;
    }
    success(s) {
        log_data(chalk_1.default.green(s), this._prefixToString(this._prefix));
        return this;
    }
    error(s) {
        log_data(chalk_1.default.red(s), this._prefixToString(this._prefix));
        return this;
    }
    warn(s) {
        log_data(chalk_1.default.yellow(s), this._prefixToString(this._prefix));
        return this;
    }
    info(s) {
        log_data(chalk_1.default.whiteBright(s), this._prefixToString(this._prefix));
        return this;
    }
    log(s) {
        log_data(chalk_1.default.white(s), this._prefixToString(this._prefix));
        return this;
    }
    debug(s) {
        log_data(chalk_1.default.grey(s), this._prefixToString(this._prefix));
        return this;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=log.js.map