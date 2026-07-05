/** @format */

/**
 * Green-gate runner for the JL test activities (src/tests/lisp-like/).
 * Each file runs through the CLI; expectations per entry:
 *   asserts: false   — smoke only, exit 0 suffices (no asserts expected)
 *   expectFails: N   — exactly N asserts must fail (failure-path gate)
 *   default          — exit 0, at least one assert OK, zero FAIL
 *
 * Requires SBCL on PATH (several suites compare against a real Lisp).
 */

const {spawnSync} = require('child_process');
const path = require('path');

// tests mirror the src buckets they verify
const TESTS = [
  {file: 'src/tests/kernel/jmc-eval.jl.ts'}, // meta-circular gate
  {file: 'src/tests/cl/conditionals.jl.ts'},
  {file: 'src/tests/cl/defines.ts'},
  {file: 'src/tests/cl/file-system.ts'},
  {file: 'src/tests/cl/input-output.ts'},
  {file: 'src/tests/cl/conses.ts'},
  {file: 'src/tests/cl/iteration-and-mapping.ts'},
  {file: 'src/tests/cl/numbers.ts'},
  {file: 'src/tests/sbcl/sb-posix.ts'},
  {file: 'src/tests/modules/requires.jl.ts'}, // require-able vocabulary gate
  {file: 'src/tests/quicklisp/simple-parallel-tasks.ts'},
  {file: 'src/tests/quicklisp/trivial-shell.ts'},
  // failure-reporting gate: these asserts fail BY DESIGN
  {file: 'src/tests/quicklisp/lisp-unit.ts', expectFails: 4, expectOks: 4},
  // smoke only: its real tests exit the process by design
  {file: 'src/tests/cl/error.ts', asserts: false},
];

const root = path.join(__dirname, '..');
let failures = 0;

for (const t of TESTS) {
  const r = spawnSync('npx', ['ts-node', './src/cli.ts', `./${t.file}`], {
    cwd: root,
    shell: true,
    encoding: 'utf8',
    timeout: 10 * 60 * 1000,
  });
  const out = (r.stdout || '') + (r.stderr || '');
  const oks = (out.match(/assert-x: OK/g) || []).length;
  const fails = (out.match(/assert-x FAIL/g) || []).length;

  let failed;
  if (t.asserts === false) {
    failed = r.status !== 0;
  } else if (typeof t.expectFails === 'number') {
    failed =
      r.status !== 0 ||
      fails !== t.expectFails ||
      (typeof t.expectOks === 'number' && oks !== t.expectOks);
  } else {
    failed = r.status !== 0 || fails > 0 || oks === 0;
  }

  console.log(
    `${failed ? 'FAIL' : 'ok  '} ${t.file}  (asserts: ${oks} ok, ${fails} fail, exit ${r.status})`
  );
  if (failed) failures++;
}

if (failures) {
  console.error(`\n${failures} test file(s) failed.`);
  process.exit(1);
} else {
  console.log(`\nall ${TESTS.length} test files green`);
}
