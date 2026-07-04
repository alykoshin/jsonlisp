/** @format */

/**
 * @module eval/tracer
 * [machinery] Step/level limits for runaway scripts (CL: trace).
 * Error messages keep the historical "JsonScript" name.
 */

// NB: raised from the historical 1000/100 (which predate enforcement and
// were sized for coarse jsonScript steps, not per-eval steps): every
// argument evaluation counts as a step now, and meta-circular interpretation
// multiplies steps further.
const DFLT_MAX_STEPS = 100_000;
const DFLT_MAX_LEVELS = 500;

export interface TracerConstructorOptions {
  maxLevels?: number;
  maxSteps?: number;
}

export class Tracer {
  actionCount: number;
  level: number;
  maxLevels: number;
  maxSteps: number;

  constructor(opts: {maxLevels?: number; maxSteps?: number} = {}) {
    this.maxSteps =
      typeof opts.maxSteps !== 'undefined' ? opts.maxSteps : DFLT_MAX_STEPS;
    this.maxLevels =
      typeof opts.maxLevels !== 'undefined' ? opts.maxLevels : DFLT_MAX_LEVELS;
    this.level = 0;
    this.actionCount = 0;
  }

  _incLevel() {
    if (++this.level > this.maxLevels)
      throw new Error(
        `JsonScript: Script stack overflow. Script went deeper than ${this.maxLevels} levels. You can increase this value by setting maxLevels value in options.`
      );
  }
  //
  _decLevel() {
    if (--this.level < 0)
      throw new Error(`JsonScript: Script stack underflow.`);
  }
  //
  _incSteps() {
    if (++this.actionCount > this.maxSteps)
      throw new Error(
        `JsonScript: Script was run for more than ${this.maxSteps} steps. You can increase this value by setting maxSteps value in options.`
      );
    return this.actionCount;
  }

  /**
   * Per-evaluation guard called by eval_: counts a step and checks the
   * environment's recursion level against maxLevels.
   */
  guard(currentLevel: number): void {
    this._incSteps();
    if (currentLevel > this.maxLevels)
      throw new Error(
        `JsonScript: Script stack overflow. Script went deeper than ${this.maxLevels} levels. You can increase this value by setting maxLevels value in options.`
      );
  }

  reset(): void {
    this.actionCount = 0;
    this.level = 0;
  }
}
