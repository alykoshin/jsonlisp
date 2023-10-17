/** @format */

const DFLT_MAX_STEPS = 1000;
const DFLT_MAX_LEVELS = 100;

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

  reset(): void {
    this.actionCount = 0;
    this.level = 0;
  }
}
