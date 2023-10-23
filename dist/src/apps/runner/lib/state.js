"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewState = void 0;
// export function createState<Atom>({
//   runner,
//   scopes,
//   level,
//   name,
// }: {
//   runner: Runner;
//   scopes: Scopes<Atom>;
//   level: number;
//   name: string;
// }): EvState {
//   const state: EvState = {
//     actions: runner.actions,
//     logger: new Logger({id: runner.actionCount, level, name}),
//     runner: runner,
//     scopes: scopes,
//     // evaluate: runner.evaluate,
//   };
//   return {
//     ...state,
//   };
// }
class NewState {
    runner;
    scopes;
    actions;
    logger;
    constructor(init) {
        // Object.assign(this, init);
        this.runner = init.runner;
        this.scopes = init.scopes;
        this.actions = init.runner.actions;
        this.logger = init.logger;
    }
    async evaluate(expr) {
        return this.runner.evaluate.call(this, expr, this);
    }
}
exports.NewState = NewState;
//# sourceMappingURL=state.js.map