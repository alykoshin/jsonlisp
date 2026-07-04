"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracer = void 0;
/**
 * @module eval/tracer
 * [machinery] Step/level limits for runaway scripts (CL: trace).
 * Error messages keep the historical "JsonScript" name.
 */
// NB: raised from the historical 1000/100 (which predate enforcement and
// were sized for coarse jsonScript steps, not per-eval steps): every
// argument evaluation counts as a step now, and meta-circular interpretation
// multiplies steps further.
const DFLT_MAX_STEPS = 100000;
const DFLT_MAX_LEVELS = 500;
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
    /**
     * Per-evaluation guard called by eval_: counts a step and checks the
     * environment's recursion level against maxLevels.
     */
    guard(currentLevel) {
        this._incSteps();
        if (currentLevel > this.maxLevels)
            throw new Error(`JsonScript: Script stack overflow. Script went deeper than ${this.maxLevels} levels. You can increase this value by setting maxLevels value in options.`);
    }
    reset() {
        this.actionCount = 0;
        this.level = 0;
    }
}
exports.Tracer = Tracer;
//# sourceMappingURL=tracer.js.map