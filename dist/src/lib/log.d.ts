/** @format */
import { Parameter } from './runner';
type LogParam = Parameter;
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
export declare class Logger<T extends {
    [key: string]: any;
}> {
    _prefix: T;
    constructor(prefix: T);
    prefix(prefix: T): void;
    new(prefix: Partial<T>): Logger<T & Partial<T>>;
    _prefixToString(prefix: T): string;
    success(...params: LogParam[]): this;
    fatal(...params: LogParam[]): never;
    error(...params: LogParam[]): this;
    warn(...params: LogParam[]): this;
    info(...params: LogParam[]): this;
    log(...params: LogParam[]): Logger<T>;
    debug(...params: LogParam[]): Logger<T>;
}
export {};
