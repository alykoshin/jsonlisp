<!-- @format -->

# Architecture — JL and its sources

`tools-runner` embeds **JL** — a Lisp whose concrete syntax is JSON/JSON5/JS arrays
(see the `.jl.json5` / `.jl.ts` file extensions and the companion package `lisp2jl`,
"Lisp → JL"). The runner itself descends from an earlier "jsonScript" design
(`_doc/jsonScript.md`; the `Tracer` error messages still say `JsonScript:`), onto
which the Lisp was layered.

The code is organized in four layers. Each layer's name, scope, and boundary is
taken from a specific source in the Lisp literature, documented below.

```
src/eval/       L0  the evaluator        — McCarthy's universal function; SICP's eval/apply
src/kernel/     L1  the axiomatic kernel — Graham, "The Roots of Lisp" (2002)
src/cl/         L2  standard vocabulary  — the COMMON-LISP package (ANSI)
src/contrib/    L3  host bindings        — SBCL's contrib/ tree
```

**Layer law** (enforced by `check:layers`):

```
eval ← kernel ← cl          contrib → eval (always), contrib → kernel (T/NIL only)
contrib never → cl          eval imports nothing above it
```

The host (`apps/runner`, `cli.ts`) assembles all four layers plus user activities.

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
   is open (closer to fexprs). Only lambda-form application is applicative.
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
| derived: `null.` `and.`                          | `derived.ts` (`null_`, `and_`)     | done   |
| derived: `not.` `append.` `list.` `pair.` `assoc.` | `derived.ts`                     | TODO   |
| `eval.` `evcon.` `evlis.` (meta-circular)        | JL translation as a test activity  | TODO   |

The derived functions are written *in JL itself* (via `createExecutorFn`),
mirroring the paper's self-hosting construction — `_` replaces Graham's `.`
suffix (`null.` → `null_`).

**Acceptance gate:** the meta-circular test — Graham's `eval.` translated to JL
runs through the CLI and its results match SBCL. If the kernel can run the
paper's evaluator, it is complete and correctly wired.

---

## L2 `src/cl/` — standard vocabulary (the COMMON-LISP package)

Named after the ANSI package — per SBCL docs, *"home of symbols defined by the
ANSI language specification"*. This layer is JL's analog: the vocabulary a CL
programmer expects, implemented natively: `conditionals` (`if when unless`),
`defines` (`setq`), `lists`, `operators` (`+ - * / = < > and or not …`),
`iteration-and-mapping` (`progn mapc mapcar`), `input-output`
(`print princ format terpri`), `error` (`error assert`), `system`
(`sleep time`), `documentation` (`? ;`). Module names follow CL-book chapter
naming and are kept.

Correctness is defined by reference to a real implementation: the test suites
(`src/tests/lisp-like/`, `apps/test-runner`) evaluate each JL expression and
compare against SBCL output via `contrib/sbcl` (`$sbcl-to-list`).

---

## L3 `src/contrib/` — host bindings (SBCL's contrib model)

SBCL ships non-ANSI capability as **contribs** — separate modules in its
`contrib/` tree, loaded with `require` (SB-EXT: *"public: miscellaneous
supported extensions to the ANSI Lisp spec"*). JL's L3 copies the model and
even the names:

- `sb-posix.ts` — named after the SBCL contrib (*"a lispy interface to standard
  POSIX facilities"*): `getenv setenv chdir getcwd`.
- `trivial-shell.ts`, `lisp-unit.ts`, `simple-parallel-tasks.ts` — named after
  the third-party CL libraries they imitate.
- `file-system.ts` — host filesystem ops (several names are ANSI —
  `probe-file`, `delete-file` — but the module is host I/O and stays here).
- `build/`, `os/`, `axios.ts`, `sbcl/` — this tool's own contribs (`$`-prefixed
  host actions: `$zip $version $shelljs $axios $sbcl`).

`require` ≈ `Activities.plug()`: the loading machinery already exists; contribs
are statically assembled today but could become plug-loadable without redesign.

**Naming conventions:** `$name` marks a host action (established). New contrib
actions should use CL package-prefix style `package:name` — precedent already
in the codebase (`str:to-file`) and in real activities (`demo:build:all` in the
wild).

---

## Acceptance gates for the layering

1. **Meta-circular** (kernel): Graham's `eval.` in JL runs via the CLI, matches SBCL.
2. **Self-hosting** (whole stack): `npm start build` — the tool rebuilds itself
   with the refactored interpreter (the `tools/tools-runner.activity.json5`
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
