"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defpackage = void 0;
function defpackage(pkg, actions, opts = {}) {
    const out = {};
    for (const [name, def] of Object.entries(actions)) {
        // `pkg:sym` names the same symbol as `sym` — executors that dispatch on
        // their invoked name (e.g. the cl/numbers operators family) must receive
        // the bare symbol name, not the qualified spelling.
        if (typeof def === 'function') {
            const qualified = (_, args, st) => def(name, args, st);
            // applicative/special-form nature must survive qualification
            qualified.isClosure = def.isClosure;
            out[`${pkg}:${name}`] = qualified;
        }
        else {
            out[`${pkg}:${name}`] = def;
        }
        if (opts.use !== false)
            out[name] = def;
    }
    return out;
}
exports.defpackage = defpackage;
//# sourceMappingURL=package.js.map