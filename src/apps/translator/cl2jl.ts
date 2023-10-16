/** @format */

import path from 'path';
import {compileFileDir} from './lib/compile-pegjs';

async function run() {
  const base_path = './resources/downloads/';
  const grammarPathname = path.resolve(__dirname, './grammar/lisp.pegjs');
  await compileFileDir(base_path, grammarPathname);
}
run();
