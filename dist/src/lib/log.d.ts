/** @format */
import { Parameter } from '../apps/runner/lib/types';
import { Runner } from '../apps/runner/runner';
type LogParam = Parameter;
declare const errorTypes: readonly ["fatal", "error", "warn", "success", "info", "log", "debug"];
type ErrorType = (typeof errorTypes)[number];
export interface LogPrefix {
    id: number;
    level: number;
    name: string;
}
export declare class SimpleLogger {
    _level: ErrorType;
    _prefix: string;
    constructor(prefix: string, level?: ErrorType);
    isLevelEnabled(level: ErrorType): boolean;
    fatal(...params: LogParam[]): never;
    error(...params: LogParam[]): this;
    warn(...params: LogParam[]): this;
    success(...params: LogParam[]): this;
    info(...params: LogParam[]): this;
    log(...params: LogParam[]): this;
    debug(...params: LogParam[]): this;
}
export declare class GenericLogger<T extends {
    [key: string]: any;
}> {
    _level: ErrorType;
    _prefix: T;
    logger: SimpleLogger;
    constructor(prefix: T, level?: ErrorType);
    prefix(prefix: T): void;
    _prefixToString(prefix: T): string;
    fatal(...params: LogParam[]): never;
    error(...params: LogParam[]): void;
    warn(...params: LogParam[]): void;
    success(...params: LogParam[]): void;
    info(...params: LogParam[]): void;
    log(...params: LogParam[]): void;
    debug(...params: LogParam[]): void;
}
export declare class Logger extends GenericLogger<LogPrefix> {
    new(prefix: Partial<LogPrefix>, level?: ErrorType): Logger;
    newNext(prefix: Partial<LogPrefix> | undefined, level: "error" | "log" | "info" | "warn" | "fatal" | "success" | "debug" | undefined, runner: Runner): Logger;
    newUp(prefix: Partial<LogPrefix> | undefined, level: "error" | "log" | "info" | "warn" | "fatal" | "success" | "debug" | undefined, runner: Runner): Logger;
    newNextUp(runner: Runner, prefix?: Partial<LogPrefix>, level?: ErrorType): Logger;
    next(runner: Runner): void;
    up(): void;
}
export {};
