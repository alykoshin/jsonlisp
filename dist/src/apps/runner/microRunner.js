"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroInterpreter = void 0;
const log_1 = require("../../lib/log");
const object_1 = require("@utilities/object");
const GenericInterpreter_1 = require("./lib/GenericInterpreter");
const actions_1 = require("../../actions/lisp-like/helpers/actions");
const curry_1 = __importDefault(require("../../lib/curry"));
// export interface ListExecutorMap {
// [name: string]: ListExecutor;
// }
class MicroInterpreter extends GenericInterpreter_1.GenericInterpreter {
    actions;
    constructor({ actions }) {
        super();
        this.actions = actions;
        // this.microEvaluate = this.microEvaluate.bind(this)
    }
    async evaluate(expr, state) {
        if (!state) {
            const DEBUG_LEVEL = 'debug'; //'info';
            const logger = new log_1.Logger({ id: 0, level: 0, name: 'micro' }, DEBUG_LEVEL);
            const initialState = {
                runner: this,
                actions: this.actions,
                // name: '',
                scopes: new object_1.Scopes(),
                logger,
                evaluate: (expr) => this.evaluate(expr, initialState),
            };
            state = { ...initialState };
        }
        else {
            const newState = {
                ...state,
                logger: state.logger.newUp(),
            };
        }
        // const evl = async (p: Parameter) => await this.evaluate(p, state);
        // state.evaluate = evl;
        state.evaluate = (0, curry_1.default)(this.evaluate, state);
        // const EVAL_FN_NAME = 'eval';
        // const fn = this.actions[EVAL_FN_NAME];
        // ensureFunction(fn, `function "${EVAL_FN_NAME}" not defined`);
        // const res = (fn as Function)(EVAL_FN_NAME, [expr], state);
        // return res;
        // // prettier-ignore
        return await (0, actions_1.execAction)('eval', expr, state);
    }
}
exports.MicroInterpreter = MicroInterpreter;
//# sourceMappingURL=microRunner.js.map