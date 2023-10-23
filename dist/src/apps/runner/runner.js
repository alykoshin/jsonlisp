"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
const object_1 = require("@utilities/object");
const log_1 = require("../../lib/log");
const state_1 = require("./lib/state");
// import {curry} from '../../lib/curry';
const tracer_1 = require("./lib/tracer");
const actions_1 = require("../../actions");
const eval_1 = require("../../actions/lisp-like/core/eval");
// const DEFAULT_DEBUG = false;
const DEFAULT_DEBUG = true;
class Runner {
    // scopes: Scopes<T>;
    actions;
    actionCount = 0;
    tracer;
    constructor({ maxLevels, maxSteps } = {}) {
        // this.scopes = new Scopes<T>();
        this.actions = actions_1.actions;
        this.tracer = new tracer_1.Tracer({ maxLevels, maxSteps });
    }
    async init({ activity, scope, } = {}) {
        // `this.actions` must be populated before creating `state`
        if (activity) {
            this.actions = {
                ...this.actions,
                ...activity.actions,
            };
        }
        // const args = Array.isArray(action) ? action : [action];
        const scopes = scope ? new object_1.Scopes([scope]) : new object_1.Scopes();
        const st = new state_1.NewState({
            // actions: this.actions,
            logger: new log_1.Logger({ id: this.actionCount, level: 0, name: 'start' }),
            runner: this,
            scopes,
            // evaluate: runner.evaluate,
        });
        // const st: EvState = {
        //   actions: this.actions,
        //   logger: new Logger({id: this.actionCount, level: 0, name: 'start'}),
        //   runner: this,
        //   scopes,
        //   // evaluate: runner.evaluate,
        // };
        // const st: State = {
        // ...initState,
        // evaluate,
        // };
        // state.evaluate = evCurry.call(runner, runner.evaluate, state);
        this.tracer.reset();
        st.logger.warn(`need to clean up the scopes on start`);
        st.logger.debug(`this.actions: ${Object.keys(this.actions).join(',')}`);
        return st;
    }
    async start(args, st) {
        st.logger.debug(`Starting action "${JSON.stringify(args)}"`);
        const result = await this.evaluate(args, st);
        // return await execNamedAction('eval', a, { ...st, );
        st.logger.debug(`Exited with result ${JSON.stringify(result)}`);
    }
    async evaluate(expr, st) {
        const evaluate = async (expr) => await this.evaluate(expr, st);
        st.logger.debug('runner.evaluate:', expr);
        return await (0, eval_1.execNamedAction)('eval', [expr], { ...st, evaluate });
    }
}
exports.Runner = Runner;
//# sourceMappingURL=runner.js.map