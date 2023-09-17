"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GenericNamedStorage {
    _values;
    constructor() {
        this._values = undefined;
    }
    _add(name, value) {
        throw new Error('Not implemented');
    }
    add(values) {
        throw new Error('Not implemented');
        //_.forEach(values, (value, indexOrKey, collection) => this._add(indexOrKey, value));
    }
    get(name) {
        throw new Error('Not implemented');
    }
    has(name) {
        return !!this.get(name);
    }
    ensureName(name) {
        if (!name)
            throw new Error(`name is mandatory`);
        return true;
    }
    ensureUnique(name) {
        this.ensureName(name);
        if (this.has(name))
            throw new Error(`name must be unique`);
        return true;
    }
    find(predicate, fromIndex) {
        // https://lodash.com/docs/#find
        // _.find(collection, [predicate=_.identity], [fromIndex=0])
        //Iterates over elements of collection, returning the first element predicate returns truthy for. The predicate is invoked with three arguments: (value, index|key, collection).
        return _.find(this._values, predicate, fromIndex);
    }
    forEach(cb) {
        // https://lodash.com/docs/#forEach
        // _.forEach(collection, [iteratee=_.identity])
        //Iterates over elements of collection and invokes iteratee for each element. The iteratee is invoked with three arguments: (value, index|key, collection). Iteratee functions may exit iteration early by explicitly returning false.
        //Note: As with other "Collections" methods, objects with a "length" property are iterated like arrays. To avoid this behavior use _.forIn or _.forOwn for object iteration.
        return _.forEach(this._values, cb);
    }
}
class ObjectNamedStorage extends GenericNamedStorage {
    constructor() {
        super();
        this._values = {};
    }
    _addOne(name, value) {
        this.ensureUnique(name);
        if (this.has(name))
            throw new Error(`name "${name}" must be unique`);
        this._values[name] = value;
    }
    get(name) {
        return this._values[name];
    }
    has(name) {
        return !!this.get(name);
    }
    add(values) {
        //   values = sanitizeArray(values);
        _.forEach(values, (value, indexOrKey, collection) => this._addOne(indexOrKey, value));
    }
}
class TokenStorage extends ObjectNamedStorage {
    constructor() {
        super();
    }
    _lookup(jsonScript, data) {
        // iterate all token type definition
        //for (let tokenTypeName in tokenTypes) if (tokenTypes.hasOwnProperty(tokenTypeName)) {
        //  const def = tokenTypes[tokenTypeName];
        //  const fn = def.condition;
        //  if (typeof fn !== 'function') throw new Error(`def.condition must be a function`);
        //
        //  // check the condition for each definition
        //  if (fn.call(this, data)) {
        //    // if condition is true
        //    const result = { type: tokenTypeName, def };
        //    this.debug('_lookup', {result});
        //    return result;
        //  }
        //}
        let result;
        this.forEach((value, indexOrKey, collection) => {
            const conditionFn = value.condition;
            if (typeof conditionFn !== 'function')
                throw new Error(`def.condition must be a function`);
            // console.log('token:', indexOrKey, data)
            // console.log('=======================this:', this)
            if (conditionFn.call(jsonScript, data)) {
                // found token
                result = { type: indexOrKey, def: value };
                return false; // stop the iteration
            }
            // continue iteration
        });
        //console.log('found', found);
        // if condition is true
        if (result) {
            //this.debug('_lookup', {result});
            return result;
        }
        else {
            // we checked all definitions and found nothing
            console.error('_lookup: data:', data);
            throw new Error('Unable to find token type');
        }
    }
}
//# sourceMappingURL=namedStorage.js.map