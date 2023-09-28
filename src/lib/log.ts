/** @format */

import chalk from 'chalk';
import {AtomDefinition, Parameter} from './runner';
import {type} from 'os';

/*
debug(...args: any[]) {
  if (DEFAULT_DEBUG) {
    const prefix = stringUtils.repeat('*', this._level);
    console.debug(`${prefix} [${this._steps}/${this._level}]`, ...args);
  }
}
*/

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

const errorTypes = [
  'success',
  'fatal',
  'error',
  'warn',
  'info',
  'log',
  'debug',
] as const;

type ErrorType = (typeof errorTypes)[number];

type ErrorColorsMap = Record<ErrorType, typeof chalk.Color>;

const errorColors: ErrorColorsMap = {
  success: 'green',
  fatal: 'redBright',
  error: 'red',
  warn: 'yellow',
  info: 'whiteBright',
  log: 'white',
  debug: 'grey',
};

const textPrefixes: Partial<Record<ErrorType, string>> = {
  // success: "",
  fatal: 'FATAL',
  error: 'ERROR',
  warn: 'WARN',
  // info: "",
  // log: 'white',
  // debug: 'grey',
};

function log_data(
  errorType: ErrorType,
  prefix: LogStrPrefix = '',
  data: LogParam | LogParam[]
) {
  const color = errorColors[errorType];
  const data_ = Array.isArray(data) ? data : [data];

  const txtPrefix = textPrefixes[errorType] || '';

  const sData = data_.map((d) => debugParameter(d)).join(' ');

  const l = getLogStrs(color, prefix, sData);
  l.forEach((s) => process.stdout.write(s));
  return l.join('\n');
}

function debugParameter(value: AtomDefinition): string {
  if (typeof value === 'object') {
    return JSON.stringify(value);
  } else {
    return debugPrimitive(value);
  }
}

function debugPrimitive(value: AtomDefinition): string {
  let result = String(value);
  if (typeof value === 'string') result = `"${result}"`;
  return result;
}

//

export interface LogPrefix {
  id: number | string;
  level: number;
  name?: string;
}

/**

 //
 // Possible implementations:
 //
  const logger = new Logger({ id: 1, level: 1}).log('test')

  const logger = Logger({id, level}).log('test')
  logger2 = logger({id: 2}).log('abc').debug('def')
 */

export class Logger<T extends {[key: string]: any}> {
  _prefix: T;

  constructor(prefix: T) {
    this._prefix = prefix;
    // this.prefix(prefix);
  }

  prefix(prefix: T) {
    this._prefix = prefix;
  }

  new(prefix: Partial<T>) {
    return new Logger({...this._prefix, ...prefix});
  }

  _prefixToString(prefix: T) {
    let p = `${this._prefix.level}/${this._prefix.id}`;

    // let namePart = prefix.name ? `/${prefix.name}` : ``;
    let namePart = prefix.name ? prefix.name : ``;

    return `[${p}] [${namePart}]`;
  }

  //
  success(...params: LogParam[]): this {
    log_data('success', this._prefixToString(this._prefix), params);
    return this;
  }

  fatal(...params: LogParam[]): never {
    const msg = log_data('fatal', this._prefixToString(this._prefix), params);
    throw new Error(params.join(' '));
  }

  error(...params: LogParam[]): this {
    log_data('error', this._prefixToString(this._prefix), params);
    return this;
  }

  warn(...params: LogParam[]): this {
    log_data('warn', this._prefixToString(this._prefix), params);
    return this;
  }

  info(...params: LogParam[]): this {
    log_data('info', this._prefixToString(this._prefix), params);
    return this;
  }

  log(...params: LogParam[]): Logger<T> {
    log_data('log', this._prefixToString(this._prefix), params);
    return this;
  }

  debug(...params: LogParam[]): Logger<T> {
    log_data('debug', this._prefixToString(this._prefix), params);
    return this;
  }
}
