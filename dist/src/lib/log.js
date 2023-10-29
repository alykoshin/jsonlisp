"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.AbstractLogger = void 0;
const chalk_1 = __importDefault(require("chalk"));
function getLogStrs(color, prefix = '', data) {
    data = String(data);
    return data.split(/\r?\n/).map((line) => {
        const colorPrefix = typeof prefix !== 'undefined' ? chalk_1.default.grey(prefix) + ' ' : '';
        const colorData = chalk_1.default[color](line);
        return colorPrefix + colorData + '\n';
        // process.stdout.write(l + '\n')
    });
}
const errorLevels = [
    'fatal',
    'error',
    'warn',
    'success',
    'info',
    'log',
    'debug',
];
// const DEFAULT_DEBUG: ErrorLevel = 'info';
const DEFAULT_ERROR_LEVEL = 'debug';
const errorColors = {
    fatal: 'redBright',
    error: 'red',
    warn: 'yellow',
    success: 'green',
    info: 'whiteBright',
    log: 'white',
    debug: 'grey',
};
const textPrefixes = {
    // success: "",
    fatal: 'FATAL',
    error: 'ERROR',
    warn: 'WARN',
    // info: "",
    // log: 'white',
    // debug: 'grey',
};
function log_data(errorType, prefix = '', data) {
    const color = errorColors[errorType];
    const data_ = Array.isArray(data) ? data : [data];
    const txtPrefix = textPrefixes[errorType] || '';
    const sData = data_.map((d) => debugParameter(d)).join(' ');
    const l = getLogStrs(color, prefix, sData);
    l.forEach((s) => process.stdout.write(s));
    return l.join('\n');
}
function debugParameter(value) {
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    else {
        return debugPrimitive(value);
    }
}
function debugPrimitive(value) {
    let result = String(value);
    if (typeof value === 'string')
        result = `"${result}"`;
    return result;
}
class AbstractLogger {
    _errorLevel = DEFAULT_ERROR_LEVEL;
    constructor(errorLevel = DEFAULT_ERROR_LEVEL) {
        this.setErrorLevel(errorLevel);
        // this._errorLevel = errorLevel;
    }
    setErrorLevel(errorLevel) {
        this._errorLevel = errorLevel;
        // this.debug(`errorLevel: ${this._errorLevel}`);
    }
    isLevelEnabled(level) {
        return errorLevels.indexOf(this._errorLevel) >= errorLevels.indexOf(level);
    }
    log_data(level, data) {
        if (this.isLevelEnabled(level))
            return log_data(level, this.getPrefix(), data);
    }
    //
    fatal(...params) {
        this.log_data('fatal', params);
        throw new Error(params.join(' '));
    }
    error(...params) {
        this.log_data('error', params);
    }
    warn(...params) {
        this.log_data('warn', params);
    }
    success(...params) {
        this.log_data('success', params);
    }
    info(...params) {
        this.log_data('info', params);
    }
    log(...params) {
        this.log_data('log', params);
    }
    debug(...params) {
        this.log_data('debug', params);
    }
}
exports.AbstractLogger = AbstractLogger;
/* export class SimpleLogger extends AbstractLogger {
  _prefix: string;

  constructor(prefix: string, errorLevel: ErrorLevel = 'debug') {
    super(errorLevel);
    this._prefix = prefix;
    this.debug(`errorLevel: ${errorLevel}`);
    // console.log('>>>>>>>', errorLevel);
  }

  getPrefix(): string {
    return this._prefix;
  }
}
*/
class Logger extends AbstractLogger {
    state;
    constructor(state, errorLevel = DEFAULT_ERROR_LEVEL) {
        super(errorLevel);
        this.state = state;
    }
    _prefix1(state) {
        return state ? `[${state.id}/${state.level}]` : `[]`;
    }
    _prefix2(state) {
        if (state) {
            const res = this.isLevelEnabled('debug')
                ? state.names.join('/')
                : state.names[state.names.length - 1];
            return `[${res}]`;
            // return state ? `[${state.names.join('/')}]` : `[]`;
        }
        else {
            return `[]`;
        }
    }
    getPrefix() {
        let p = this._prefix1(this.state);
        p += ' ' + this._prefix2(this.state);
        return p;
    }
    new(state, level = this._errorLevel) {
        // const newState = {
        //   ...this.state,
        //   ...state,
        //   name: this.state.name + '/' + state.name,
        // };
        // this._prefix = _prefixToString(state);
        return new Logger(state, level);
        // return new Logger(newState, level);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=log.js.map