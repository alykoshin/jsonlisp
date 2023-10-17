/** @format */

import chalk from 'chalk';
import {Atom, Parameter} from '../apps/runner/lib/types';
import {Runner} from '../apps/runner/runner';

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
  'fatal',
  'error',
  'warn',
  'success',
  'info',
  'log',
  'debug',
] as const;

type ErrorType = (typeof errorTypes)[number];

type ErrorColorsMap = Record<ErrorType, typeof chalk.Color>;

const errorColors: ErrorColorsMap = {
  fatal: 'redBright',
  error: 'red',
  warn: 'yellow',
  success: 'green',
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

export interface LogPrefix {
  id: number;
  level: number;
  name: string;
}

export class SimpleLogger {
  _level: ErrorType;
  _prefix: string;
  constructor(prefix: string, level: ErrorType = 'debug') {
    this._level = level;
    this._prefix = prefix;
    // this.prefix(prefix);
  }

  isLevelEnabled(level: ErrorType) {
    return errorTypes.indexOf(this._level) >= errorTypes.indexOf(level);
  }

  //

  fatal(...params: LogParam[]): never {
    const msg = log_data('fatal', this._prefix, params);
    throw new Error(params.join(' '));
  }

  error(...params: LogParam[]): this {
    if (this.isLevelEnabled('error')) log_data('error', this._prefix, params);
    return this;
  }

  warn(...params: LogParam[]): this {
    if (this.isLevelEnabled('warn')) log_data('warn', this._prefix, params);
    return this;
  }

  success(...params: LogParam[]): this {
    if (this.isLevelEnabled('success'))
      log_data('success', this._prefix, params);
    return this;
  }

  info(...params: LogParam[]): this {
    if (this.isLevelEnabled('info')) log_data('info', this._prefix, params);
    return this;
  }

  log(...params: LogParam[]): this {
    if (this.isLevelEnabled('log')) log_data('log', this._prefix, params);
    return this;
  }

  debug(...params: LogParam[]): this {
    if (this.isLevelEnabled('debug')) log_data('debug', this._prefix, params);
    return this;
  }
}

/**

 //
 // Possible implementations:
 //
  const logger = new Logger({ id: 1, level: 1}).log('test')

  const logger = Logger({id, level}).log('test')
  logger2 = logger({id: 2}).log('abc').debug('def')
 */

function _prefixToString(prefix: LogPrefix): string {
  let p = `${prefix.id}/${prefix.level}`;

  // let namePart = prefix.name ? `/${prefix.name}` : ``;
  let namePart = prefix.name ? prefix.name : ``;

  return `[${p}] [${namePart}]`;
}

export class GenericLogger<T extends {[key: string]: any}> {
  _level: ErrorType;
  _prefix: T;
  logger: SimpleLogger;
  constructor(prefix: T, level: ErrorType = 'debug') {
    this._level = level;
    this._prefix = prefix;
    const sPrefix = this._prefixToString(prefix);
    this.logger = new SimpleLogger(sPrefix, level);
    // this.prefix(prefix);
  }

  prefix(prefix: T) {
    this._prefix = prefix;
  }

  _prefixToString(prefix: T): string {
    let p = `${this._prefix.level}/${this._prefix.id}`;

    // let namePart = prefix.name ? `/${prefix.name}` : ``;
    let namePart = prefix.name ? prefix.name : ``;

    return `[${p}] [${namePart}]`;
  }

  //
  fatal(...params: LogParam[]): never {
    this.logger.fatal(...params);
  }

  error(...params: LogParam[]): void {
    this.logger.error(...params);
  }

  warn(...params: LogParam[]): void {
    if (errorTypes.indexOf(this._level) >= errorTypes.indexOf('warn'))
      log_data('warn', this._prefixToString(this._prefix), params);
  }

  success(...params: LogParam[]): void {
    if (errorTypes.indexOf(this._level) >= errorTypes.indexOf('success'))
      log_data('success', this._prefixToString(this._prefix), params);
  }

  info(...params: LogParam[]): void {
    if (errorTypes.indexOf(this._level) >= errorTypes.indexOf('info'))
      log_data('info', this._prefixToString(this._prefix), params);
  }

  log(...params: LogParam[]): void {
    if (errorTypes.indexOf(this._level) >= errorTypes.indexOf('log'))
      log_data('log', this._prefixToString(this._prefix), params);
  }

  debug(...params: LogParam[]): void {
    if (errorTypes.indexOf(this._level) >= errorTypes.indexOf('debug'))
      log_data('debug', this._prefixToString(this._prefix), params);
  }
}

export class Logger extends GenericLogger<LogPrefix> {
  new(prefix: Partial<LogPrefix>, level: ErrorType = this._level) {
    return new Logger({...this._prefix, ...prefix}, level);
  }

  newNext(
    prefix: Partial<LogPrefix> = {},
    level: ErrorType = this._level,
    runner: Runner
  ) {
    const res = new Logger(
      {
        ...this._prefix,
        ...prefix,
        name: this._prefix.name + '/' + prefix.name,
      },
      level
    );
    res.next(runner);
    return res;
  }

  newUp(
    prefix: Partial<LogPrefix> = {},
    level: ErrorType = this._level,
    runner: Runner
  ) {
    const res = new Logger(
      {
        ...this._prefix,
        ...prefix,
        name: this._prefix.name + '/' + prefix.name,
      },
      level
    );
    res.up();
    return res;
  }

  newNextUp(
    runner: Runner,
    prefix: Partial<LogPrefix> = {},
    level: ErrorType = this._level
  ) {
    const res = new Logger(
      {
        ...this._prefix,
        ...prefix,
        name: this._prefix.name + '/' + prefix.name,
      },
      level
    );
    res.next(runner);
    res.up();
    return res;
  }

  next(runner: Runner) {
    runner.actionCount++;
    this._prefix.id = runner.actionCount;
    // return this;
  }
  up() {
    this._prefix.level += 1;
    // return this;
  }
}
