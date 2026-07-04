"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
const object_1 = require("@utilities/object");
const eval_1 = require("../../eval");
const tracer_1 = require("../../eval/tracer");
const actions_1 = require("../../actions");
class Runner {
    actions;
    tracer;
    errorLevel;
    constructor({ maxLevels, maxSteps, errorLevel, } = {}) {
        this.actions = actions_1.actions;
        this.tracer = new tracer_1.Tracer({ maxLevels, maxSteps });
        this.errorLevel = errorLevel;
    }
    async init({ activities, scope, } = {}) {
        //
        // `this.actions` must be populated before creating the environment
        if (activities) {
            this.actions = {
                ...this.actions,
                ...activities.actions(),
            };
        }
        const logLevel = this.errorLevel ?? 'log';
        const scopes = scope ? new object_1.Scopes([scope]) : new object_1.Scopes();
        const st = (0, eval_1.makeEvaluator)({
            actions: this.actions,
            scopes,
            errorLevel: logLevel,
            tracer: this.tracer,
        });
        st.logger.warn(`need to clean up the scopes on start`);
        return st;
    }
    async start(args, st) {
        st.logger.debug(`Starting action "${JSON.stringify(args)}"`);
        const result = await st.evaluate(args);
        st.logger.debug(`Exited with result ${JSON.stringify(result)}`);
    }
}
exports.Runner = Runner;
//# sourceMappingURL=runner.js.map