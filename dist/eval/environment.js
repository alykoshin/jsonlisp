"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = exports.Environment = void 0;
const object_1 = require("@utilities/object");
const log_1 = require("../lib/log");
const GLOBAL_ACTION_ID = true;
let lastActionId = 0;
const evalNotWired = async () => {
    throw new Error(`Evaluator not wired into the environment — construct it via makeEvaluator() (eval/index)`);
};
class Environment {
    id;
    level;
    // name: string;
    names;
    scopes;
    actions;
    evalFn;
    tracer;
    logger;
    constructor(init) {
        this.id = init.id === undefined ? 0 : init.id;
        this.level = init.level === undefined ? 0 : init.level;
        this.names = init.names?.slice() || ['*'];
        this.actions = init.actions;
        this.evalFn = init.evalFn ?? evalNotWired;
        this.tracer = init.tracer;
        this.scopes = init.scopes == undefined ? new object_1.Scopes() : init.scopes.copy();
        this.logger = init.logger ? init.logger : new log_1.Logger(this);
        if (init.errorLevel)
            this.logger.setErrorLevel(init.errorLevel);
        this.evaluate = this.evaluate.bind(this);
    }
    async evaluate(expr) {
        this.logger.debug('state.evaluate -> eval');
        return await this.evalFn('|', [expr], this);
    }
    new() {
        return new Environment(this);
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
exports.Environment = Environment;
exports.State = Environment;
//# sourceMappingURL=environment.js.map