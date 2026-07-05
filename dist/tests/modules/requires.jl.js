"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// prettier-ignore
exports.config = {
    base_dir: '.',
    version: '0.0.0',
    requires: [{ name: 'sb-posix', use: false }, 'lisp-unit'],
    actions: {
        default: [
            'list',
            ['test-requires'],
            ['princ', 'assert-x:\n' + '  OK:   ${ assert_ok_count }\n' + '  FAIL: ${ assert_fail_count }'],
        ],
        // JS action: does a name exist in the assembled vocabulary?
        'has-action': async (_, args, st) => !!st.actions[String(args[0])],
        'test-requires': ['list',
            // strict package: qualified present, bare alias absent
            ['assert-true', ['has-action', 'sb-posix:getenv']],
            ['assert-false', ['has-action', 'getenv']],
            // used package: bare names available (we are using assert-* itself)
            ['assert-true', ['has-action', 'assert-equal']],
            ['assert-true', ['has-action', 'lisp-unit:assert-equal']],
            // not required -> absent entirely
            ['assert-false', ['has-action', 'shell-command']],
            ['assert-false', ['has-action', 'trivial-shell:shell-command']],
            ['assert-false', ['has-action', '$zip']],
            // core language always present
            ['assert-true', ['has-action', 'cond']],
            ['assert-true', ['has-action', 'cl:car']],
            ['assert-true', ['has-action', 'jmc:null_']],
            // the strict, qualified action actually works
            ['assert-true', ['sb-posix:getenv', 'PATH']],
        ],
    },
};
exports.default = exports.config;
//# sourceMappingURL=requires.jl.js.map