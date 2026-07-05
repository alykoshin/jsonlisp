<!-- @format -->

# tools-runner / JL

**tools-runner** is a task automation CLI whose scripts are written in **JL**
— a Lisp whose concrete syntax is JSON/JSON5/JavaScript arrays. A nested
array is an S-expression; the first element is the operator:

```json5
// build.jl.jsonc
{
  base_dir: './',
  version: '0.0.0',
  actions: {
    default: ['print', 'Usage: build | release'],
    build: ['list',
      ['$shelljs', 'rm', '-rf', 'dist/*'],
      ['shell-command', 'tsc --build ./tsconfig.json', {cwd: './', env: {}}],
    ],
    release: ['list',
      ['build'],
      ['$version', 'patch'],
      ['plist',                       // parallel!
        ['$zip', {file_names: ['./dist/'], archive_prefix: 'dist', out_dir: './_archive'}],
        ['$zip', {file_names: ['./src/'],  archive_prefix: 'src',  out_dir: './_archive'}]],
    ],
  },
}
```

```sh
npx tools-runner ./build.jl.jsonc release
```

Activity files (`.json5`, `.json`, `.ts`, `.js`) are libraries of named
**actions**; the CLI command line itself is a JL form (`[action, ...params]`).
Data passed via `-f config.json` / `-j '{...}'` becomes the variable scope,
available to `${...}` templates: `"${dir}/${files.ca}"`.

This repo is simultaneously a practical tool (portable, declarative,
parallel build/ops scripts) and a language experiment: JL implements the
Lisp of McCarthy's 1960 paper — verified by running Graham's *Roots of
Lisp* meta-circular `eval.` on itself, and by comparing the vocabulary
against a real SBCL.

## Usage

```
tools-runner <activity-file> [action=default] [parameters...]
  -f, --data-file <file>     data object -> variable scope (.ts/.js/.json/.json5)
  -j, --json-data <json>     inline JSON data (deep-overrides --data-file)
  -5, --json5-data <json5>   inline JSON5 data
  -d, --debug                debug logging
```

During development: `ts-node ./src/cli.ts <activity> [action] …`.

Example activities in-repo: [openssl cert generation](src/local-projects/openssl/)
(with a JSON-schema'd config), [mongo backup/restore](src/local-projects/mongo/),
and the tool's own build pipeline ([tools/tools-runner.jl.jsonc](tools/tools-runner.jl.jsonc))
— tools-runner builds and releases itself.

## The language

See **[ARCHITECTURE.md](ARCHITECTURE.md)** for the full design and its
sources (McCarthy 1960, Graham 2002, SBCL packaging). In brief:

| Layer | What | Named after |
| --- | --- | --- |
| `src/eval/` | the evaluator (eval/apply, environment, `${}` templating) | McCarthy's universal function |
| `src/kernel/` | `quote atom eq car cdr cons cond`, `lambda`/`defun`, derived fns | Graham's axiomatic kernel |
| `src/cl/` | ANSI vocabulary; modules = CLHS chapters | the `COMMON-LISP` package |
| `src/sbcl/` | `sb-posix` (getenv setenv chdir getcwd) | SBCL contribs |
| `src/quicklisp/` | `trivial-shell`, `lisp-unit`, `simple-parallel-tasks`, `alexandria`, `str` | third-party CL systems |
| `src/jl/` | dialect extensions (`?`, `;`, `nullp`, `%`) | (ours; cf. SB-EXT) |
| `src/host/` | non-Lisp `$`-actions: `$zip $version $shelljs $axios` | — |

Every Lisp action also has a package-qualified name (`cl:car`,
`sb-posix:getenv`, `jmc:null_`) alongside its bare alias. Activities may
restrict their vocabulary like CL's `require`:

```json5
requires: ['sb-posix', {name: 'trivial-shell', use: false}, 'host'],
```

— core language always included; `use: false` = qualified names only.

Deliberate divergences from CL (documented in ARCHITECTURE.md): every named
action is a special form (receives unevaluated args); unbound symbols
fall back to `${…}`-templated strings; JL is a Lisp-2; evaluation is async
with parallel forms (`plist`).

## Tests

```sh
npm test              # layer law + kernel-vs-SBCL table + JL test activities
npm run test-core     # kernel/derived expressions compared against SBCL
npm run test:jl       # test activities (incl. the meta-circular eval. gate)
npm run check:layers  # import-direction law
```

Requires [SBCL](https://www.sbcl.org/) on `PATH` — correctness is defined by
comparison with a real Common Lisp. The flagship test,
[jmc-eval.jl.jsonc](src/tests/kernel/jmc-eval.jl.jsonc), runs the paper's
`eval.` (translated to JL) on the JL interpreter itself.

## Install

```sh
npm install --save-dev tools-runner
```

Node ≥ 18. `dist/` is committed — the package is its own build system
(`npm start build`).

## Links

[github.com](https://github.com/alykoshin/tools-runner) ·
[npmjs.com](https://www.npmjs.com/package/tools-runner)

## License

MIT · [Alexander](https://github.com/alykoshin/)
