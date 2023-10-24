"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
const object_1 = require("@utilities/object");
const state_1 = require("./lib/state");
const tracer_1 = require("./lib/tracer");
const actions_1 = require("../../actions");
class Runner {
    actions;
    // actionCount: number = 0;
    tracer;
    errorLevel;
    constructor({ maxLevels, maxSteps, errorLevel, } = {}) {
        this.actions = actions_1.actions;
        this.tracer = new tracer_1.Tracer({ maxLevels, maxSteps });
        this.errorLevel = errorLevel;
    }
    async init({ activity, scope, } = {}) {
        //
        // `this.actions` must be populated before creating `state`
        if (activity) {
            this.actions = {
                ...this.actions,
                ...activity.actions,
            };
        }
        // st.logger.debug(`this.actions: ${Object.keys(this.actions).join(',')}`);
        const logLevel = activity?.logLevel ? activity?.logLevel : 'log';
        const scopes = scope ? new object_1.Scopes([scope]) : new object_1.Scopes();
        const st = new state_1.State({
            runner: this,
            scopes,
            errorLevel: logLevel,
        });
        st.logger.warn(`need to clean up the scopes on start`);
        return st;
    }
    async start(args, st) {
        st.logger.debug(`Starting action "${JSON.stringify(args)}"`);
        const result = await st.evaluate(args);
        // return await execNamedAction('eval', a, { ...st, );
        st.logger.debug(`Exited with result ${JSON.stringify(result)}`);
    }
}
exports.Runner = Runner;
//# sourceMappingURL=runner.js.map