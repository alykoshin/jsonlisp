"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
const object_1 = require("@utilities/object");
const eval_1 = require("../eval");
const tracer_1 = require("../eval/tracer");
const modules_1 = require("../modules");
class Runner {
    actions;
    tracer;
    errorLevel;
    constructor({ maxLevels, maxSteps, errorLevel, } = {}) {
        this.actions = modules_1.actions;
        this.tracer = new tracer_1.Tracer({ maxLevels, maxSteps });
        this.errorLevel = errorLevel;
    }
    async init({ activities, scope, } = {}) {
        //
        // `this.actions` must be populated before creating the environment
        if (activities) {
            // like CL's (require :sb-posix): an activity may restrict the
            // vocabulary to core + declared packages (see actions/assemble)
            const requires = activities.requires();
            const base = requires ? (0, modules_1.assemble)(requires) : this.actions;
            this.actions = {
                ...base,
                ...activities.actions(),
            };
        }
        const logLevel = this.errorLevel ?? 'log';
        const scopes = scope ? new object_1.Scopes([scope]) : new object_1.Scopes();
        // Scopes are constructed fresh from the data param on every init —
        // nothing carries over between runs (the old "clean up the scopes"
        // warning was vestigial).
        const st = (0, eval_1.makeEvaluator)({
            actions: this.actions,
            scopes,
            errorLevel: logLevel,
            tracer: this.tracer,
        });
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