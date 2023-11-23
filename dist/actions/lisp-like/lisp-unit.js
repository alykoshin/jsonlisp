"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const lodash_1 = __importDefault(require("lodash"));
const validateArgs_1 = require("../../apps/runner/lib/validateArgs");
/**
 * @module lisp-unit
 *
 * @description
 * lisp-unit -- Common Lisp library that supports unit testing --
 * {@link https://www.quicklisp.org/beta/UNOFFICIAL/docs/lisp-unit/doc/index.html} <br>
 * <br>
 * == alternative doc == <br>
 * <br>
 * CLUnit -- Common Lisp Unit Test Framework --
 * {@link https://tgutu.github.io/clunit/} <br>
 * <br>
 * What's the difference between `eq`, `eql`, `equal` and `equalp`, in Common Lisp? --
 * {@link https://stackoverflow.com/questions/547436/whats-the-difference-between-eq-eql-equal-and-equalp-in-common-lisp} <br>
 */
class Counter {
    name;
    scopes;
    scope;
    constructor({ name }) {
        this.name = name;
        // this.scopes = scopes;
        // this.scope = scopes.global();
    }
    setDefault({ scopes }, defaultValue) {
        this.scopes = scopes;
        this.scope = scopes.global();
        if (typeof this.scope?.get(this.name) === 'undefined') {
            this.reset({ scopes }, typeof defaultValue !== 'undefined' ? defaultValue : 0);
        }
    }
    reset({ scopes }, defaultValue) {
        this.scopes = scopes;
        this.scope = scopes.global();
        this.scope?.set(this.name, defaultValue ? defaultValue : 0);
    }
    inc({ scopes }, num) {
        this.scopes = scopes;
        this.scope = scopes.global();
        const value = this.scope.get(this.name, 0);
        return this.scope.set(this.name, value + 1);
    }
}
const okCounter = new Counter({ name: 'assert_ok_count' });
const failCounter = new Counter({ name: 'assert_fail_count' });
exports.actions = {
    /** @name assert-true */
    'assert-true': async function (action, params, { evaluate, scopes, logger }) {
        (0, validateArgs_1.validateArgs)(params, { minCount: 1 });
        const pActual = await evaluate(params[0]);
        const bActual = !!pActual;
        const sActual = JSON.stringify(pActual);
        okCounter.setDefault({ scopes });
        failCounter.setDefault({ scopes });
        if (bActual) {
            let msg = `assert-x: OK:   `;
            msg += params[1] ? await evaluate(params[1]) : sActual;
            logger.success(msg);
            okCounter.inc({ scopes });
        }
        else {
            let msg = `assert-x FAIL: `;
            msg += params[1] ? await evaluate(params[1]) : sActual;
            const printParams = params.slice(1);
            for (const p of printParams) {
                await evaluate(['print', p]);
            }
            logger.error(msg);
            failCounter.inc({ scopes });
        }
        return bActual;
    },
    /** @name assert-false */
    'assert-false': async function (action, params, { evaluate }) {
        (0, validateArgs_1.validateArgs)(params, { minCount: 1 });
        const cond = await evaluate(params[0]);
        return evaluate(['assert-true', !cond, ...params.slice(1)]);
    },
    /** @name assert-equal */
    'assert-equal': async function (action, params, { evaluate, logger }) {
        (0, validateArgs_1.validateArgs)(params, { exactCount: [2, 3] });
        const actual = await evaluate(params[0]);
        logger.debug('actual', actual);
        const expected = await evaluate(params[1]);
        logger.debug('expected', expected);
        const res = lodash_1.default.isEqual(actual, expected);
        logger.debug('res', res);
        const sValue = JSON.stringify({ actual, expected });
        return evaluate(['assert-true', res, params[2] || sValue]);
    },
};
exports.default = exports.actions;
//# sourceMappingURL=lisp-unit.js.map