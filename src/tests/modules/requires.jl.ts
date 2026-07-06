/** @format */

/**
 * Gate for the require-able vocabulary (ARCHITECTURE.md):
 * - this activity declares `requires`, so it gets core (cl-core/jmc/jl)
 *   plus ONLY the listed packages;
 * - sb-posix is required with {use: false}: qualified names only
 *   (sb-posix:getenv works, bare getenv does not exist);
 * - lisp-unit is required normally (bare assert-* available);
 * - cl-files is a required CLHS chapter (ring 2) -> present;
 * - the other chapters (printer beyond print/princ, conses beyond list,
 *   sequences, environment) are NOT required -> absent, qualified included;
 * - trivial-shell is NOT required -> completely absent.
 */

import {Activity} from '../../toplevel/Activities';

// prettier-ignore
export const config: Activity = {
  base_dir: '.',
  version: '0.0.0',
  requires: [{name: 'sb-posix', use: false}, 'lisp-unit', 'cl-files'],
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
      ['assert-true',  ['has-action', 'sb-posix:getenv']],
      ['assert-false', ['has-action', 'getenv']],
      // used package: bare names available (we are using assert-* itself)
      ['assert-true',  ['has-action', 'assert-equal']],
      ['assert-true',  ['has-action', 'lisp-unit:assert-equal']],
      // not required -> absent entirely
      ['assert-false', ['has-action', 'shell-command']],
      ['assert-false', ['has-action', 'trivial-shell:shell-command']],
      ['assert-false', ['has-action', '$zip']],
      // core language always present
      ['assert-true',  ['has-action', 'cond']],
      ['assert-true',  ['has-action', 'cl:car']],
      ['assert-true',  ['has-action', 'jmc:null_']],
      // ring 1 (cl-core): glue picked from the chapters is language
      ['assert-true',  ['has-action', 'if']],
      ['assert-true',  ['has-action', 'setq']],
      ['assert-true',  ['has-action', 'print']],
      ['assert-true',  ['has-action', 'princ']],
      ['assert-true',  ['has-action', 'assert']],
      ['assert-true',  ['has-action', 'list']],
      ['assert-true',  ['has-action', '+']],
      ['assert-true',  ['has-action', '=']],
      // ring 2: unrequired CLHS chapters are library -> absent entirely
      ['assert-false', ['has-action', 'format']],
      ['assert-false', ['has-action', 'cl:format']],
      ['assert-false', ['has-action', 'mapcar']],
      ['assert-false', ['has-action', 'length']],
      ['assert-false', ['has-action', 'sleep']],
      ['assert-false', ['has-action', 'load']],
      // ring 2: a required chapter (cl-files) is present, qualified too
      ['assert-true',  ['has-action', 'ensure-directories-exist']],
      ['assert-true',  ['has-action', 'cl:ensure-directories-exist']],
      // the strict, qualified action actually works
      ['assert-true',  ['sb-posix:getenv', 'PATH']],
    ],
  },
};

export default config;
