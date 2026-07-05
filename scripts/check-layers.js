/** @format */

/**
 * Layer-law enforcement (see ARCHITECTURE.md):
 *
 *   eval      -> lib only
 *   kernel    -> eval, lib
 *   cl        -> eval, kernel, lib
 *   jl        -> eval, kernel, cl, lib (the implementation's extensions
 *                extend the standard — SB-EXT freely uses COMMON-LISP)
 *   sbcl / quicklisp / host
 *             -> eval, kernel, lib (never cl, never each other)
 *   lib       -> layer-neutral: imports no layer at all
 *   (modules/, toplevel/, local-projects/, tests/ sit above the layers)
 *
 * Exits non-zero listing every violation.
 */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');

const LAYERS = ['eval', 'kernel', 'cl', 'sbcl', 'quicklisp', 'jl', 'host'];
const HOSTY = ['modules', 'toplevel', 'local-projects', 'tests'];

const FORBIDDEN = {
  eval: ['kernel', 'cl', 'sbcl', 'quicklisp', 'jl', 'host', ...HOSTY],
  kernel: ['cl', 'sbcl', 'quicklisp', 'jl', 'host', ...HOSTY],
  cl: ['sbcl', 'quicklisp', 'jl', 'host', ...HOSTY],
  sbcl: ['cl', 'quicklisp', 'jl', 'host', ...HOSTY],
  quicklisp: ['cl', 'sbcl', 'jl', 'host', ...HOSTY],
  jl: ['sbcl', 'quicklisp', 'host', ...HOSTY],
  host: ['cl', 'sbcl', 'quicklisp', 'jl', ...HOSTY],
  lib: [...LAYERS, ...HOSTY],
};

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.ts')) out.push(p);
  }
  return out;
}

const IMPORT_RE = /from\s+'([^']+)'/g;

let violations = 0;

for (const [layer, forbidden] of Object.entries(FORBIDDEN)) {
  const layerDir = path.join(SRC, layer);
  for (const file of walk(layerDir)) {
    const text = fs.readFileSync(file, 'utf8');
    for (const m of text.matchAll(IMPORT_RE)) {
      const spec = m[1];
      if (!spec.startsWith('.')) continue; // package import
      const resolved = path
        .resolve(path.dirname(file), spec)
        .replace(/\\/g, '/');
      const srcNorm = SRC.replace(/\\/g, '/');
      for (const f of forbidden) {
        if (resolved.startsWith(`${srcNorm}/${f}/`) || resolved === `${srcNorm}/${f}`) {
          console.error(
            `LAYER VIOLATION: ${path.relative(SRC, file)} imports '${spec}' (${layer} -> ${f})`
          );
          violations++;
        }
      }
    }
  }
}

if (violations) {
  console.error(`\n${violations} layer violation(s).`);
  process.exit(1);
} else {
  console.log('layers OK');
}
