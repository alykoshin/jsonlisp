"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
const object_1 = require("@utilities/object");
const log_1 = require("../../../lib/log");
const eval_1 = require("../../../actions/lisp-like/core/eval");
const GLOBAL_ACTION_ID = true;
let lastActionId = 0;
class State {
    id;
    level;
    // name: string;
    names;
    runner;
    scopes;
    actions;
    logger;
    constructor(init) {
        // Object.assign(this, init);
        this.id = init.id === undefined ? 0 : init.id;
        this.level = init.level === undefined ? 0 : init.level;
        // this.name = init.name || 'start';
        this.names = init.names?.slice() || ['*'];
        this.runner = init.runner;
        this.scopes = init.scopes == undefined ? new object_1.Scopes() : init.scopes.copy();
        this.actions = init.runner.actions;
        this.logger = init.logger ? init.logger : new log_1.Logger(this);
        if (init.errorLevel)
            this.logger.setErrorLevel(init.errorLevel);
        this.evaluate = this.evaluate.bind(this);
    }
    async evaluate(expr) {
        // return this.runner.evaluate.call(this, expr, this);
        this.logger.debug('state.evaluate -> eval');
        return await (0, eval_1.execNamedAction)('eval', [expr], this);
    }
    new() {
        return new State(this);
        // return new State(omit(this, 'logger'));
    }
    next() {
        if (GLOBAL_ACTION_ID) {
            lastActionId++;
            this.id = lastActionId;
        }
        else {
            this.id++;
        }
        this.logger.debug('next');
        return this;
    }
    up(name) {
        this.level++;
        // this.name = name;
        this.names.push(name);
        if (GLOBAL_ACTION_ID) {
            // lastActionId++;
            // this.id = lastActionId;
        }
        else {
            // lastActionId++;
            this.id = 0;
        }
        this.logger = this.logger.new(this);
        this.logger.debug('up');
        return this;
    }
    newNextUp(name) {
        const res = this.new().up(name);
        res.logger = this.logger.new(res);
        return res;
    }
}
exports.State = State;
//# sourceMappingURL=state.js.map