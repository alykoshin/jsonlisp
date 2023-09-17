import chalk from "chalk";
import {AtomDefinition} from "./runner";
import stringUtils from "@utilities/string";


/*
debug(...args: any[]) {
  if (DEFAULT_DEBUG) {
    const prefix = stringUtils.repeat('*', this._level);
    console.debug(`${prefix} [${this._steps}/${this._level}]`, ...args);
  }
}
*/


export function log_data(data: number | string, prefix: number | string = '') {
  data = data.toString()
  data
    .split(/\r?\n/)
    .forEach(line => {
      const l = typeof prefix !== 'undefined'
        ? chalk.grey(`[${prefix}] `) + line
        : line;
      process.stdout.write(l + "\n")
    })
}

function debugPrimitive(value: AtomDefinition): string {
  let result = String(value);
  if (typeof value === 'string') result = `"${result}"`;
  return result;
}

//
export interface LogPrefix {
  id: number | string,
  level: number
}


/**

 //
 // Possible implementations:
 //
 const logger = new Logger({ id: 1, level: 1}).log('test')

 const logger = Logger({id, level}).log('test')
 logger2 = logger({id: 2}).log('abc').debug('def')



 */

type LogData = boolean | number | string;

export class Logger<T extends { [key: string]: any }> {
  _prefix: T

  constructor(prefix: T) {
    this._prefix = prefix;
    // this.prefix(prefix);
  }

  prefix(prefix: T) {
    this._prefix = prefix;
  }

  new(prefix: Partial<T>) {
    return new Logger({ ...this._prefix, ...prefix });
  }

  _prefixToString(prefix: T) {
    return `${this._prefix.level}/${this._prefix.id}`;
  }

  success(s: LogData) {
    log_data(chalk.green(s), this._prefixToString(this._prefix));
    return this;
  }

  error(s: LogData) {
    log_data(chalk.red(s), this._prefixToString(this._prefix));
    return this;
  }

  warn(s: LogData) {
    log_data(chalk.yellow(s), this._prefixToString(this._prefix));
    return this;
  }

  info(s: LogData) {
    log_data(chalk.whiteBright(s), this._prefixToString(this._prefix));
    return this;
  }

  log(s: LogData) {
    log_data(chalk.white(s), this._prefixToString(this._prefix))
    return this;
  }

  debug(s: LogData) {
    log_data(chalk.grey(s), this._prefixToString(this._prefix))
    return this;
  }

}
