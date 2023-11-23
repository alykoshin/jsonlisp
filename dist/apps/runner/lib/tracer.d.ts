/** @format */
export interface TracerConstructorOptions {
    maxLevels?: number;
    maxSteps?: number;
}
export declare class Tracer {
    actionCount: number;
    level: number;
    maxLevels: number;
    maxSteps: number;
    constructor(opts?: {
        maxLevels?: number;
        maxSteps?: number;
    });
    _incLevel(): void;
    _decLevel(): void;
    _incSteps(): number;
    reset(): void;
}
