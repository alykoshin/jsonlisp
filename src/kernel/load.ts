/** @format */

/**
 * @module kernel/load
 * Cold load: run a JL program file through the REAL evaluator over a given
 * boot vocabulary — SBCL loading its own Lisp-written library. Nothing is
 * special-cased per form: whether a top-level form cold-loads is decided by
 * the boot vocabulary, not by this loader. The one reader-level rule is
 * comment stripping — in CL `;` is reader syntax and comments never reach
 * eval, so `[";", …]` forms are dropped by readJlProgramSync (which the
 * runtime `load`, cl/system-construction, shares — one reader, two
 * environments).
 */

import {Actions, isList, List} from '../eval/sexpr';
import {makeEvaluator} from '../eval';
import {readJson5Sync} from '../lib/fileUtils/read-write/json5FileUtils';

/**
 * @name readJlProgramSync
 * The reader: parse a JL program file — a top-level ARRAY of forms, Lisp
 * source proper (an object is the other file shape: an activity/actions
 * map) — and strip comment forms, per CL reader semantics.
 */
export function readJlProgramSync(sourcePath: string): List {
  const program = readJson5Sync(sourcePath);
  if (!isList(program)) {
    throw new Error(
      `"${sourcePath}" is not a JL program — expected a top-level array ` +
        `of forms (an object is an activity/actions map)`
    );
  }
  return program.filter((form) => !(isList(form) && form[0] === ';'));
}

/**
 * @name coldLoadJlProgram
 * Evaluate each form of a program file in a fresh environment seeded with
 * `bootVocab`, and return what the program ADDED to the image beyond it
 * (`defun` is itself the registering op — it writes the function namespace).
 * Boot scopes are discarded: a cold-loaded program's yield is actions only.
 */
export async function coldLoadJlProgram(
  sourcePath: string,
  bootVocab: Actions
): Promise<Actions> {
  const image: Actions = {...bootVocab};
  const st = makeEvaluator({actions: image, errorLevel: 'warn'});
  for (const form of readJlProgramSync(sourcePath)) {
    await st.evaluate(form);
  }
  const out: Actions = {};
  for (const [name, def] of Object.entries(image)) {
    if (bootVocab[name] !== def) out[name] = def;
  }
  return out;
}
