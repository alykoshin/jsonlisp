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
    /**
     * Per-evaluation guard called by eval_: counts a step and checks the
     * environment's recursion level against maxLevels.
     */
    guard(currentLevel: number): void;
    reset(): void;
}
