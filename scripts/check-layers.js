/** @format */

/**
 * Layer-law enforcement (see ARCHITECTURE.md):
 *
 *   eval    -> lib only (nothing in kernel/cl/contrib/actions/apps/activities)
 *   kernel  -> eval, lib
 *   cl      -> eval, kernel, lib
 *   contrib -> eval, kernel, lib   (never cl, never apps)
 *   lib     -> layer-neutral: none of eval/kernel/cl/contrib/actions/apps
 *
 * Exits non-zero listing every violation.
 */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');

const FORBIDDEN = {
  eval: ['kernel', 'cl', 'contrib', 'actions', 'apps', 'activities'],
  kernel: ['cl', 'contrib', 'actions', 'apps', 'activities'],
  cl: ['contrib', 'actions', 'apps', 'activities'],
  contrib: ['cl', 'actions', 'apps', 'activities'],
  lib: ['eval', 'kernel', 'cl', 'contrib', 'actions', 'apps', 'activities'],
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
