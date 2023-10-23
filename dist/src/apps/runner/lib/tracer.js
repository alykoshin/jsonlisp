"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracer = void 0;
const DFLT_MAX_STEPS = 1000;
const DFLT_MAX_LEVELS = 100;
class Tracer {
    actionCount;
    level;
    maxLevels;
    maxSteps;
    constructor(opts = {}) {
        this.maxSteps =
            typeof opts.maxSteps !== 'undefined' ? opts.maxSteps : DFLT_MAX_STEPS;
        this.maxLevels =
            typeof opts.maxLevels !== 'undefined' ? opts.maxLevels : DFLT_MAX_LEVELS;
        this.level = 0;
        this.actionCount = 0;
    }
    _incLevel() {
        if (++this.level > this.maxLevels)
            throw new Error(`JsonScript: Script stack overflow. Script went deeper than ${this.maxLevels} levels. You can increase this value by setting maxLevels value in options.`);
    }
    //
    _decLevel() {
        if (--this.level < 0)
            throw new Error(`JsonScript: Script stack underflow.`);
    }
    //
    _incSteps() {
        if (++this.actionCount > this.maxSteps)
            throw new Error(`JsonScript: Script was run for more than ${this.maxSteps} steps. You can increase this value by setting maxSteps value in options.`);
        return this.actionCount;
    }
    reset() {
        this.actionCount = 0;
        this.level = 0;
    }
}
exports.Tracer = Tracer;
//# sourceMappingURL=tracer.js.map