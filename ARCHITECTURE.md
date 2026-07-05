<!-- @format -->

# Architecture — JL and its sources

`tools-runner` embeds **JL** — a Lisp whose concrete syntax is JSON/JSONC/JS arrays
(see the file-format rule below and the companion package `lisp2jl`,
"Lisp → JL"). The runner itself descends from an earlier "jsonScript" design
(`_doc/jsonScript.md`; the `Tracer` error messages still say `JsonScript:`), onto
which the Lisp was layered.

**File formats — language is visible in the filename.** JL programs use
compound extensions `<name>.jl.<syntax>`:

| Extension | Meaning |
| --- | --- |
| `.jl.jsonc` | **canonical pure JL**: strict JSON + comments, no trailing commas — VS Code natively applies `$schema` (activity.schema.json) with IntelliSense |
| `.jl.json` | pure JL, generated/interchange (lisp2jl output target) |
| `.jl.json5` | accepted — legacy pure-JL files in the wild |
| `.jl.ts` `.jl.js` `.jl.mjs` `.jl.cjs` | **FFI-carrying** JL: the activity contains JS actions (foreign code); `.jl.ts` needs ts-node |

A plain `.ts` under `src/` is implementation, never a JL program. Every
parsed activity is validated against `src/toplevel/activity.schema.json`
(ajv) at load time — that is the real enforcement; editor `$schema` support
is a jsonc-only bonus. Pure-`.jl.jsonc` activities run on the compiled
`dist/cli.js` with no TypeScript machinery at all.

The code is organized in four layers. Each layer's name, scope, and boundary is
taken from a specific source in the Lisp literature, documented below.

```
src/eval/       L0  the evaluator          — McCarthy's universal function; SICP's eval/apply
src/kernel/     L1  the axiomatic kernel   — Graham, "The Roots of Lisp" (2002)
src/cl/         L2  ANSI COMMON-LISP       — modules named after CLHS chapters
src/sbcl/           SBCL packages emulated — sb-posix
src/quicklisp/      third-party CL systems — trivial-shell, lisp-unit,
                    simple-parallel-tasks, alexandria, str
src/jl/             JL dialect extensions  — '?', ';' (parallels SB-EXT)
src/host/           non-Lisp host tooling  — $-marked: build/, os/, axios, sbcl-bridge/
```

The vocabulary beyond the kernel is **split by origin**: ANSI (`cl`), the
implementation we mirror (`sbcl`), the third-party CL ecosystem
(`quicklisp`), our own dialect (`jl`), and things with no Lisp identity at
all (`host`). Membership test: *which Lisp-world package is this named
for?* — none means `host`.

**Layer law** (enforced by `npm run check:layers`):

```
eval ← kernel ← cl ← jl        (jl extends the standard, as SB-EXT uses CL)
sbcl, quicklisp, host → eval, kernel only — never cl, never each other
eval imports nothing above it; lib/ is layer-neutral (SB-INT style)
```

Above the layers sit the runtime and support directories, each named for
its governing concept:

```
src/modules/         the module registry + assemble(requires) — CL's
                     require/provide (*modules*); `requires:` entries are
                     CL module-names
src/toplevel/        everything between OS argv and the first evaluate():
                     Runner, Activities/Plugins loading, dotenv settings
                     (SBCL's "toplevel"); src/cli.ts stays put — its path
                     is a consumer contract
src/local-projects/  JL-native example libraries (openssl, mongo, git) —
                     Quicklisp's local-projects: locally-developed systems
src/tests/           mirrors the buckets it verifies: harness/ (SBCL
                     referee), kernel/, cl/, sbcl/, quicklisp/, modules/,
                     host/
src/lib/             layer-neutral utilities (SB-INT): imports no layer
```

**The package system** (`eval/package.ts`): every Lisp-world action is
registered under its qualified name — `cl:car`, `jmc:null_`, `jl:?`,
`sb-posix:getenv`, `trivial-shell:shell-command`, `str:to-file` — and its
bare name (`defpackage` + implicit use-package, mirroring CL). Qualified
names are collision-free by construction; `pkg:sym` invokes the same symbol
as `sym` (executors receive the bare name). Host actions keep the `$`
prefix, unqualified.

---

## L0 `src/eval/` — the evaluator (McCarthy 1960, via Graham's jmc.lisp)

McCarthy's paper ("Recursive Functions of Symbolic Expressions and Their
Computation by Machine, Part I", 1960 — `_doc/_references_json_lisp.md`) defines
S-expressions, five elementary functions (`atom eq car cdr cons`), the forms
`quote`/`cond`/`lambda`/`label`, and the **universal function** `eval` — an
interpreter for the language written in the language. Graham's "The Roots of
Lisp" reconstructs it as runnable Common Lisp: `_doc/The Roots of Lisp - Paul
Graham/jmc.lisp`. Our dispatch maps onto that `eval.` clause-for-clause:

| `jmc.lisp` `eval.` clause                                  | `src/eval` dispatch rule                                  |
| ---------------------------------------------------------- | --------------------------------------------------------- |
| `((atom e) (assoc. e a))`                                   | string atom → scope lookup (else template string — see divergence 2) |
| `((atom (car e))` + **seven hardcoded branches**            | list with string head → **action-table lookup**            |
| `('t (eval. (cons (assoc. (car e) a) (cdr e)) a))`          | named action defined as a list → evaluate its body         |
| `((eq (caar e) 'lambda) …)`                                 | list with list head → apply lambda-form (`applyLambdaForm`) |
| `((eq (caar e) 'label) …)`                                  | `defun` registers into the function namespace              |
| `evlis.`                                                    | `evlis.ts` (evaluate an argument list, in order)           |
| `evcon.`                                                    | the clause loop inside `kernel/primitives.ts` `cond`       |

**The L0/L1 boundary is one factoring step away from the paper:** where
McCarthy/Graham hardcode the primitives as branches *inside* `eval`, L0
externalizes the vocabulary into an action table. `eval.` with its seven inline
branches replaced by table lookup *is* our evaluator; the seven entries it had
inline *are* our kernel.

### Deliberate divergences from the sources

1. **Every action is a special form.** Named actions receive *unevaluated*
   arguments and call `evaluate`/`evlis` themselves. In McCarthy/CL, functions
   get evaluated arguments and special operators are a closed set; in JL the set
   is open (closer to fexprs). The exception is canonical: closures made by
   `lambda`/`defun` (kernel/lambda, tagged `isClosure`) are applicative — the
   evaluator evlis-es their arguments exactly once, in the caller's
   environment, at the single invocation site (`execFunction`, eval/apply.ts),
   and the closure only binds values. This is McCarthy's split: `eval.` runs
   `evlis.`, apply binds (SICP §4.1, CLHS 3.1.2.1.2.3).
2. **Unbound symbol → templated string.** McCarthy's `(assoc. e a)` fails on
   unbound symbols; JL falls back to treating the string as a literal with
   `${…}` interpolation against the scope. This is the jsonScript data-binding
   feature and the reason activities can write `"${dir}/${files.ca}"`.
   Consequence: JSON has no symbol type, so strings do double duty
   (symbol-if-bound, string-otherwise; cf. json-lisp in `_doc/README.md`).
3. **JL is a Lisp-2.** The environment separates the function namespace
   (`actions`) from the value namespace (`scopes`) — like Common Lisp, unlike
   Scheme (see the Lisp-1 vs Lisp-2 reference in `_doc/README.md`).
4. **Evaluation is async**, and parallel forms exist (`plist` in
   `contrib/simple-parallel-tasks`) — beyond anything in ANSI CL.
5. **Booleans**: `T = true`, `NIL = false`, with `[]` accepted as nil
   (`isNil`) — an approximation of CL's `NIL`/empty-list identity and
   "generalized boolean" coercion (`asBoolean`), kept in `kernel/booleans.ts`.

### Internal discipline (SB-KERNEL / SB-IMPL lesson)

SBCL's own package docs are candid — SB-KERNEL: *"Theoretically this 'hides
state and types used for package integration' … but see SB-SYS re. blurring of
boundaries"*; SB-IMPL: *"a grab bag of implementation details"*. Even the
reference implementation couldn't keep its internal kernel/impl split crisp, so
L0 does **not** split physically. Instead each file is marked **model** (what
action authors may import: `sexpr`, `conditions`, `environment` surface,
`validate-args`, `evlis`) or **machinery** (private to the interpreter:
dispatch internals, templating, `tracer`), and model files never import
machinery. The evaluator is injected into the environment
(`makeEvaluator()`), never imported by it — the same shape that lets SBCL swap
`sb-eval`/`sb-fasteval` behind one interface.

---

## L1 `src/kernel/` — the axiomatic kernel (Graham 2002)

Graham names **seven primitive operators** — `quote atom eq car cdr cons cond`
— and shows that with `lambda`/`label` they suffice to write `eval.` itself
("The Surprise"). The kernel implements exactly the paper's vocabulary, in the
paper's order:

| Paper                                            | Kernel                             | Status |
| ------------------------------------------------ | ---------------------------------- | ------ |
| seven primitives                                 | `primitives.ts`                    | done   |
| `lambda`, `label` (as `defun`)                   | `lambda.ts`                        | done   |
| derived: `null.` `and.` `not.` `append.` `list.` `pair.` `assoc.` | `derived.ts`      | done   |
| `eval.` `evcon.` `evlis.` (meta-circular)        | `src/tests/kernel/jmc-eval.jl.jsonc` | done — 14/14 incl. the label/subst example |

The derived functions are written *in JL itself* (via `createExecutorFn`),
mirroring the paper's self-hosting construction — `_` replaces Graham's `.`
suffix (`null.` → `null_`).

**Acceptance gate (passing):** the meta-circular test — Graham's `eval.`
translated to JL runs through the CLI (`ts-node ./src/cli.ts
./src/tests/lisp-like/jmc-eval.jl.ts`) and reproduces the paper's examples,
including the `label subst` case. Completing it surfaced one kernel gap, now
fixed: CL's `(cons x nil)` — `cons` accepts nil as the empty list.

---

## L2 `src/cl/` — standard vocabulary (the COMMON-LISP package)

Named after the ANSI package — per SBCL docs, *"home of symbols defined by the
ANSI language specification"*. ANSI symbols only; modules are named after
**CLHS chapters**: `data-and-control-flow` (ch 5: if when unless cond setq
set prog* and or not), `conditions` (ch 9: error assert), `numbers` (ch 12:
`+ - * / 1+ 1- = < > min max mod rem zerop parse-integer`), `conses` (ch 14:
list nth first rest consp mapc mapcar), `sequences` (ch 17: length), `files`
(ch 20: probe-file delete-file rename-file directory
ensure-directories-exist), `printer` (ch 21/22: print princ prin1 format
terpri fresh-line y-or-n-p). ANSI-purity is enforced in both directions:
JL-isms (`nullp`, `%`) live in `src/jl`, not here.

Correctness is defined by reference to a real implementation: the test suites
(`src/tests/lisp-like/`, `apps/test-runner`) evaluate each JL expression and
compare against SBCL output via `contrib/sbcl` (`$sbcl-to-list`).

---

## Beyond ANSI — `src/sbcl/`, `src/quicklisp/`, `src/jl/`, `src/host/`

SBCL ships non-ANSI capability as **contribs** loaded with `require`
(SB-EXT: *"public: miscellaneous supported extensions to the ANSI Lisp
spec"*). JL sorts the same territory by origin:

- **`sbcl/`** — packages of the implementation we mirror: `sb-posix.ts`
  (*"a lispy interface to standard POSIX facilities"*): `getenv setenv chdir
  getcwd`.
- **`quicklisp/`** — third-party CL systems, named for the libraries they
  imitate: `trivial-shell` (shell-command), `lisp-unit` (assert-*),
  `simple-parallel-tasks` (plist), `alexandria`
  (read-file-into-string/write-string-into-file), `str` (to-file/from-file).
- **`jl/`** — JL's own dialect extensions — the analog of SB-EXT: vocabulary
  *we* invented, appearing in no external canon: `?` (describe), `;`
  (comment), `nullp` (ANSI name is `null`), `%` (JS-flavored rem). Like
  SB-EXT uses COMMON-LISP, jl may import cl.
- **`host/`** — no Lisp identity: `build/`, `os/` ($shelljs), `axios.ts`,
  `sbcl-bridge/` (the test harness that shells out to a real SBCL).
  All `$`-prefixed by convention.

**Vocabulary is require-able**, like SBCL contribs. An activity may declare

```json5
requires: ['sb-posix', {name: 'trivial-shell', use: false}, 'host']
```

and gets the core language (cl + jmc + jl) plus exactly those packages —
`{use: false}` registers qualified names only (CL's "don't use-package"
discipline); group names (`sbcl`, `quicklisp`, `host`) expand; no `requires`
means the full vocabulary (backward compatible). See `assemble()` in
`src/actions/index.ts` and the gate `src/tests/lisp-like/requires.jl.ts`.

**Naming:** Lisp-world actions carry package-qualified names via
`defpackage` (see above) alongside bare aliases; `$name` marks host actions.
Both precedents existed in the codebase before the mechanism (`str:to-file`;
`demo:build:all` in real activities).

---

## Semantics changes vs. pre-layers JL (2026-07, v0.0.58+)

Behavior-visible changes made while aligning to CL (SBCL as referee).
Fixes of crashes/dead code are not listed (see git log); these are the cases
where the OLD behavior worked but differed:

| Form | Before | After (CL) |
| --- | --- | --- |
| `car`, `nth` (→ `first` `second` `third`) | re-evaluated the extracted element | return it as data |
| `cdr` of 1-element list (→ `rest`) | `[]` | `NIL` (both are nil to `isNil`) |
| `if` | branch selection via re-evaluating accessors; else-branch unreachable | evaluates test, then its own branch |
| `setq` | evaluated the variable name (crashed on rebind) | name taken literally; `set` evaluates the name (computed variables) |
| `cons x NIL` | threw | `[x]` |
| `= < > <= >=` (3+ args) | only the LAST pair's result | all adjacent pairs must hold |
| `/=` (3+ args) | last pair only | all pairs distinct |
| `and` / `or` (3+ args) | last pair only | fold over all args (booleans — CL returns values; divergence) |
| `mod` with negatives | JS `%` (truncate): `mod(-7,3) = -1` | floor-mod: `= 2`; `rem`/`%` remain truncate |
| `print`/`princ`/`prin1` arity | (unchanged — always 1 arg) | confirmed CL-strict: exactly one object |
| closure (`lambda`/`defun`) arguments | inline application `[["lambda",…],…]` evaluated args TWICE (evlis at the call site, again in the closure) — quoted data got executed; named calls evaluated once | evaluated exactly once, in the caller's environment, at the single invocation site (`execFunction`; closures tagged `isClosure`, apply only binds — McCarthy/SICP/CLHS 3.1.2.1.2.3) |

## Acceptance gates for the layering

1. **Meta-circular** (kernel): Graham's `eval.` in JL runs via the CLI, matches SBCL.
2. **Self-hosting** (whole stack): `npm start build` — the tool rebuilds itself
   with the refactored interpreter (the `tools/tools-runner.jl.jsonc`
   activity is the tool's own build system).

## References

- J. McCarthy, *Recursive Functions of Symbolic Expressions…*, 1960 —
  http://www-formal.stanford.edu/jmc/recursive.pdf
- P. Graham, *The Roots of Lisp*, 2002 — local copy
  `_doc/The Roots of Lisp - Paul Graham/jmc.pdf` + runnable `jmc.lisp`
- SICP §4.1 (eval/apply, derived expressions) — the eval/apply file split and
  the term "derived"
- SBCL manual (extensions, contribs) — https://www.sbcl.org/manual/
- SBCL `package-data-list.lisp-expr` — SB-KERNEL/SB-IMPL/SB-EXT charters
- sb-docs, package `COMMON-LISP` —
  https://koji-kojiro.github.io/sb-docs/build/html/common-lisp/
- Lisp-1 vs Lisp-2 — linked from `_doc/README.md`
