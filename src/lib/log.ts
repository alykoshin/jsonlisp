/** @format */

import chalk from 'chalk';
import {Atom, Parameter} from '../apps/runner/lib/types';
import {ILoggerState} from '../apps/runner/lib/state';

type LogStrPrefix = number | string;
// type LogParam = undefined | null | boolean | number | string;
type LogParam = Parameter;

function getLogStrs(
  color: typeof chalk.Color,
  prefix: LogStrPrefix = '',
  data: LogParam
): string[] {
  data = String(data);
  return data.split(/\r?\n/).map((line) => {
    const colorPrefix =
      typeof prefix !== 'undefined' ? chalk.grey(prefix) + ' ' : '';
    const colorData = chalk[color](line);
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
] as const;

export type ErrorLevel = (typeof errorLevels)[number];

// const DEFAULT_DEBUG: ErrorLevel = 'info';
const DEFAULT_ERROR_LEVEL: ErrorLevel = 'debug';

type ErrorColorsMap = Record<ErrorLevel, typeof chalk.Color>;

const errorColors: ErrorColorsMap = {
  fatal: 'redBright',
  error: 'red',
  warn: 'yellow',
  success: 'green',
  info: 'whiteBright',
  log: 'white',
  debug: 'grey',
};

const textPrefixes: Partial<Record<ErrorLevel, string>> = {
  // success: "",
  fatal: 'FATAL',
  error: 'ERROR',
  warn: 'WARN',
  // info: "",
  // log: 'white',
  // debug: 'grey',
};

function log_data(
  errorType: ErrorLevel,
  prefix: LogStrPrefix = '',
  data: LogParam | LogParam[]
): string {
  const color = errorColors[errorType];
  const data_ = Array.isArray(data) ? data : [data];

  const txtPrefix = textPrefixes[errorType] || '';

  const sData = data_.map((d) => debugParameter(d)).join(' ');

  const l = getLogStrs(color, prefix, sData);
  l.forEach((s) => process.stdout.write(s));
  return l.join('\n');
}

function debugParameter(value: Atom): string {
  if (typeof value === 'object') {
    return JSON.stringify(value);
  } else {
    return debugPrimitive(value);
  }
}

function debugPrimitive(value: Atom): string {
  let result = String(value);
  if (typeof value === 'string') result = `"${result}"`;
  return result;
}

//

export interface ILogger {
  fatal(...params: LogParam[]): never;
  error(...params: LogParam[]): void;
  warn(...params: LogParam[]): void;
  success(...params: LogParam[]): void;
  info(...params: LogParam[]): void;
  log(...params: LogParam[]): void;
  debug(...params: LogParam[]): void;
}

export abstract class AbstractLogger implements ILogger {
  _errorLevel: ErrorLevel = DEFAULT_ERROR_LEVEL;

  constructor(errorLevel: ErrorLevel = DEFAULT_ERROR_LEVEL) {
    this.setErrorLevel(errorLevel);
    // this._errorLevel = errorLevel;
  }

  setErrorLevel(errorLevel: ErrorLevel) {
    this._errorLevel = errorLevel;
    // this.debug(`errorLevel: ${this._errorLevel}`);
  }

  abstract getPrefix(): string;

  isLevelEnabled(level: ErrorLevel) {
    return errorLevels.indexOf(this._errorLevel) >= errorLevels.indexOf(level);
  }

  log_data(level: ErrorLevel, data: LogParam | LogParam[]) {
    if (this.isLevelEnabled(level))
      return log_data(level, this.getPrefix(), data);
  }
  //

  fatal(...params: LogParam[]): never {
    this.log_data('fatal', params);
    throw new Error(params.join(' '));
  }

  error(...params: LogParam[]): void {
    this.log_data('error', params);
  }

  warn(...params: LogParam[]): void {
    this.log_data('warn', params);
  }

  success(...params: LogParam[]): void {
    this.log_data('success', params);
  }

  info(...params: LogParam[]): void {
    this.log_data('info', params);
  }

  log(...params: LogParam[]): void {
    this.log_data('log', params);
  }

  debug(...params: LogParam[]): void {
    this.log_data('debug', params);
  }
}

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

export class Logger extends AbstractLogger {
  state: ILoggerState;

  constructor(
    state: ILoggerState,
    errorLevel: ErrorLevel = DEFAULT_ERROR_LEVEL
  ) {
    super(errorLevel);
    this.state = state;
  }

  _prefix1(state: ILoggerState): string {
    return state ? `[${state.id}/${state.level}]` : `[]`;
  }

  _prefix2(state: ILoggerState): string {
    if (state) {
      const res = this.isLevelEnabled('debug')
        ? state.names.join('/')
        : state.names[state.names.length - 1];
      return `[${res}]`;
      // return state ? `[${state.names.join('/')}]` : `[]`;
    } else {
      return `[]`;
    }
  }

  getPrefix(): string {
    let p = this._prefix1(this.state);
    p += ' ' + this._prefix2(this.state);
    return p;
  }

  new(state: ILoggerState, level: ErrorLevel = this._errorLevel) {
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
