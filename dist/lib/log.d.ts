/** @format */
/**
 * lib/ is layer-neutral (SB-INT style): no imports from eval/kernel/cl/contrib.
 * The logger state shape is declared structurally here; eval/environment
 * implements it.
 */
export interface ILoggerState {
    id: number;
    level: number;
    names: string[];
}
type LogParam = unknown;
declare const errorLevels: readonly ["fatal", "error", "warn", "success", "info", "log", "debug"];
export type ErrorLevel = (typeof errorLevels)[number];
export declare const DEFAULT_ERROR_LEVEL: ErrorLevel;
export interface ILogger {
    fatal(...params: LogParam[]): never;
    error(...params: LogParam[]): void;
    warn(...params: LogParam[]): void;
    success(...params: LogParam[]): void;
    info(...params: LogParam[]): void;
    log(...params: LogParam[]): void;
    debug(...params: LogParam[]): void;
}
export declare abstract class AbstractLogger implements ILogger {
    _errorLevel: ErrorLevel;
    constructor(errorLevel?: ErrorLevel);
    setErrorLevel(errorLevel: ErrorLevel): void;
    abstract getPrefix(): string;
    isLevelEnabled(level: ErrorLevel): boolean;
    log_data(level: ErrorLevel, data: LogParam | LogParam[]): string | undefined;
    fatal(...params: LogParam[]): never;
    error(...params: LogParam[]): void;
    warn(...params: LogParam[]): void;
    success(...params: LogParam[]): void;
    info(...params: LogParam[]): void;
    log(...params: LogParam[]): void;
    debug(...params: LogParam[]): void;
}
export declare function errorLevelToNumber(el: ErrorLevel): number;
export declare class Logger extends AbstractLogger {
    state: ILoggerState;
    constructor(state: ILoggerState, errorLevel?: ErrorLevel);
    _prefix1(state: ILoggerState): string;
    _prefix2(state: ILoggerState): string;
    getPrefix(): string;
    new(state: ILoggerState, level?: ErrorLevel): Logger;
}
export {};
