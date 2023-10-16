/** @format */

import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

export const download = async function (
  i: number,
  url: string,
  base_path: string
) {
  const method = 'GET';
  const config = {
    method,
    url,
  };
  console.log(`[${i}] ${method} ${url}`);
  const response = await axios(config);
  const {data, status, statusText} = response;
  console.log(`[${i}] -> ${status} ${statusText} ${data.length} Bytes`);

  const fname = url
    .replaceAll(/^https?\:\/\//gi, '')
    .replaceAll(/\?.*$/gi, '')
    .replaceAll(/\//gi, '_');
  const outPathname = path.resolve(base_path, fname);
  console.log(`[${i}] --> ${outPathname}`);
  await fs.writeFile(outPathname, data, 'utf8');
  return data;
};

// ["setq", "$$path", "./resources/downloads/"],
//       ["$shelljs", "mkdir", "-p", "${ $$path }" ],
//       [ "plist",
//         ["write-string-into-file",  "${ $$path }sourceforge.net_p_sbcl_sbcl_ci_master_tree_src_code_pred.lisp",
//           ["$axios", "get", "https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/pred.lisp?format=raw"]]

async function run() {
  const urls = [
    'https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/pred.lisp?format=raw',
    'https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/defmacro.lisp?format=raw',
    'https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/defstruct.lisp?format=raw',
    'https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/deftype.lisp?format=raw',
    'https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/string.lisp?format=raw',
    //
    'https://sep.turbifycdn.com/ty/cdn/paulgraham/jmc.lisp?t=1688221954&',
    //
    'https://github.com/andybelltree/Mary/raw/master/demos/tic-tac-toe.lisp',
    'https://github.com/andybelltree/Mary/raw/master/lisp/fnstdlib.lisp',
    'https://github.com/andybelltree/Mary/raw/master/lisp/macrostdlib.lisp',
    'https://github.com/andybelltree/Mary/raw/master/lisp/minstdlib.lisp',
    'https://github.com/andybelltree/Mary/raw/master/lisp/stdlib.lisp',
    //
    'https://github.com/devijvers/lisp.js/raw/master/lisp/grammar/lisp.pegjs',
    'https://github.com/honza/inertia/raw/master/inertia/grammar.pegjs',
    //
    'https://github.com/eudoxia0/trivial-download/raw/master/src/trivial-download.lisp',
    'https://github.com/eudoxia0/trivial-download/raw/master/t/trivial-download.lisp',
    //
    'https://gitlab.com/criesbeck/cs325/-/raw/main/lisp-unit/lisp-unit.asd?ref_type=heads',
    'https://gitlab.com/criesbeck/cs325/-/raw/main/lisp-unit/lisp-unit.lisp?ref_type=heads',
    'https://gitlab.com/criesbeck/cs325/-/raw/main/lisp-unit/package.lisp?ref_type=heads',
    //
    'https://github.com/vindarel/cl-str/raw/master/test/test-str.lisp',
    'https://github.com/vindarel/cl-str/raw/master/str.asd',
    'https://github.com/vindarel/cl-str/raw/master/str.lisp',
    'https://github.com/vindarel/cl-str/raw/master/str.test.asd',
  ];
  const base_path = './resources/downloads/';
  const promises = urls.map(
    async (url, i) => await download(i, url, base_path)
  );
  await Promise.all(promises);
}
run();
