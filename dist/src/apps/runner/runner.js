"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
const object_1 = require("@utilities/object");
const log_1 = require("../../lib/log");
const actions_1 = require("../../actions");
const actions_2 = require("../../actions/lisp-like/helpers/actions");
// const DEFAULT_DEBUG =
//   false;
// // true;
const DFLT_MAX_STEPS = 1000;
const DFLT_MAX_LEVELS = 100;
class Runner {
    maxLevels;
    maxSteps;
    scopes;
    actions;
    actionCount = 0;
    constructor(opts = {}) {
        this.maxSteps =
            typeof opts.maxSteps !== 'undefined' ? opts.maxSteps : DFLT_MAX_STEPS;
        this.maxLevels =
            typeof opts.maxLevels !== 'undefined' ? opts.maxLevels : DFLT_MAX_LEVELS;
        this.scopes = new object_1.Scopes();
        this.actions = actions_1.actions;
    }
    async start({ activity, action, scope, }) {
        // const id = this.actionCount++;
        // const level = 0;
        const state = this._initState();
        const logger = new log_1.Logger({
            level: state.level,
            id: this.actionCount,
            name: 'start',
        });
        logger.warn(`need to clean up the scopes on start`);
        this.scopes.push(scope);
        // logger.debug(`Using config file "${activity}"`);
        // const fullConfig = await read_config(activity);
        if (activity) {
            this.actions = {
                ...this.actions,
                ...activity.actions,
            };
        }
        logger.debug(`this.actions: ${Object.keys(this.actions).join(',')}`);
        // const actionDefinition = this._getConfigAction(activity, action);
        logger.debug(`Starting action "${action}"`);
        // const actionDefinition = this.getActionImplementation(action);
        // logger.debug(`Eval "${JSON.stringify(actionDefinition)}"`);
        const a = Array.isArray(action) ? action : [action];
        const result = await this.evaluate(a, undefined);
        logger.debug(`Exited with result ${JSON.stringify(result)}`);
    }
    async evaluate(param, state_) {
        // const id = this.actionCount++;
        const id = this._incSteps();
        // const id = this.actionCount;
        const level = 0;
        const state = state_
            ? state_
            : {
                scopes: this.scopes,
                runner: this,
                actions: this.actions,
                logger: new log_1.Logger({ id, level, name: 'evaluate' }),
                evaluate: this.evaluate,
            };
        return await (0, actions_2.execAction)('eval', param, state);
    }
    _incLevel(state) {
        if (++state.level > this.maxLevels)
            throw new Error(`JsonScript: Script stack overflow. Script went deeper than ${this.maxLevels} levels. You can increase this value by setting maxLevels value in options.`);
    }
    //
    _decLevel(state) {
        if (--state.level < 0)
            throw new Error(`JsonScript: Script stack underflow.`);
    }
    //
    _incSteps() {
        if (++this.actionCount > this.maxSteps)
            throw new Error(`JsonScript: Script was run for more than ${this.maxSteps} steps. You can increase this value by setting maxSteps value in options.`);
        return this.actionCount;
    }
    _resetState(state) {
        this.actionCount = 0;
        state.level = 0;
    }
    _initState() {
        this.actionCount = 0;
        return {
            level: 0,
        };
    }
}
exports.Runner = Runner;
//# sourceMappingURL=runner.js.map