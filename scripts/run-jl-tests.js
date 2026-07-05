/** @format */

/**
 * Green-gate runner for the JL test activities (src/tests/lisp-like/).
 * Each file is run through the CLI; a file fails if the process errors,
 * any "assert-x FAIL" appears, or no assert ran at all.
 *
 * Requires SBCL on PATH (the suites compare against a real Lisp).
 * NB: src/tests/lisp-like/lisp-unit.ts is excluded — it fails by design
 * (it demos failure reporting).
 */

const {spawnSync} = require('child_process');
const path = require('path');

const TESTS = [
  'src/tests/lisp-like/jmc-eval.jl.ts', // meta-circular gate (no SBCL needed)
  'src/tests/lisp-like/conditionals.jl.ts',
  'src/tests/lisp-like/defines.ts',
  'src/tests/lisp-like/file-system.ts',
  'src/tests/lisp-like/lists.ts',
  'src/tests/lisp-like/iteration-and-mapping.ts',
  'src/tests/lisp-like/operators.ts',
];

const root = path.join(__dirname, '..');
let failures = 0;

for (const t of TESTS) {
  const r = spawnSync('npx', ['ts-node', './src/cli.ts', `./${t}`], {
    cwd: root,
    shell: true,
    encoding: 'utf8',
    timeout: 10 * 60 * 1000,
  });
  const out = (r.stdout || '') + (r.stderr || '');
  const failed =
    r.status !== 0 ||
    out.includes('assert-x FAIL') ||
    !out.includes('assert-x: OK');
  const oks = (out.match(/assert-x: OK/g) || []).length;
  const fails = (out.match(/assert-x FAIL/g) || []).length;
  console.log(
    `${failed ? 'FAIL' : 'ok  '} ${t}  (asserts: ${oks} ok, ${fails} fail, exit ${r.status})`
  );
  if (failed) failures++;
}

if (failures) {
  console.error(`\n${failures} test file(s) failed.`);
  process.exit(1);
} else {
  console.log(`\nall ${TESTS.length} test files green`);
}
