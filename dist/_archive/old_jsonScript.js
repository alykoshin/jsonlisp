"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonScript = void 0;
class GenericScript {
    beforeEach;
    afterEach;
    maxSteps;
    maxLevels;
    _steps;
    _level;
    tokens;
    constructor(/*actions: ActivityDefinition,*/ options = {}) {
        const { beforeEach, afterEach, maxSteps, maxLevels } = options;
        this.beforeEach = beforeEach;
        this.afterEach = afterEach;
        this.maxSteps = (typeof maxSteps !== 'undefined') ? maxSteps : DEFAULT_MAX_STEPS;
        this.maxLevels = (typeof maxLevels !== 'undefined') ? maxLevels : DEFAULT_MAX_LEVELS;
        this._steps = 0; // counter to prevent infinite loops
        this._level = 0; // counter to prevent stack overflow
        //this.TOKEN_BASE_TYPES = {};
        this.tokens = new TokenStorage();
    }
}
//
class JsonScript extends GenericScript {
    actions;
    //
    async __evaluate(def, { action, parameters, context, result: prevResult }) {
        let newResult = prevResult;
        let res;
        // call pre-processing callbacks
        res = await this._handlerFn([
            this.beforeEach,
            action.before
        ], { action, parameters, context, result: newResult });
        //this.debug('__evaluate:', {res =});
        if (typeof res !== 'undefined')
            newResult = res;
        // call post-processing callbacks
        res = await this._handlerFn([
            action.after,
            this.afterEach
        ], { action, parameters, context, result: newResult });
    }
    async _handlerFn(fns, { result, ...rest }) {
        fns = (Array.isArray(fns) ? fns : [fns]);
        await asyncUtils.asyncForEach(fns, async (fn) => {
            const res = (typeof (fn) === 'function')
                ? await fn.call(this, { ...rest, result })
                : result;
            if (typeof res !== 'undefined')
                result = res;
        }, undefined);
        return result;
    }
    _hasNextParam(parameters
    // : Parameters
    ) {
        return (parameters.length > 0);
    }
    _getNextParam(parameters
    // : Parameters
    ) {
        const p = parameters.splice(0, 1)[0];
        this.debug('_getNextParam:', { p });
        return p;
    }
    _executeActionDefinitionBefore({ name, definition, parameters, context, result }) {
        if (typeof definition === 'undefined')
            throw new Error(`Action definition cannot be empty`);
        this._incSteps();
        this._incLevel();
        this.debug('_executeActionBefore:', { name, definition, parameters, context, result });
    }
    _executeActionDefinitionAfter({ name, definition, parameters, context, result }) {
        this.debug('executeActionAfter:', { result });
        this._decLevel();
    }
}
exports.JsonScript = JsonScript;
//# sourceMappingURL=old_jsonScript.js.map