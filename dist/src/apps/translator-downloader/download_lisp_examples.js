"use strict";
/** @format */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const mkdirp = __importStar(require("mkdirp"));
const axios_1 = __importDefault(require("axios"));
const download = async function (i, url, base_path) {
    const method = 'GET';
    const config = {
        method,
        url,
    };
    console.log(`[${i}] ${method} ${url}`);
    const response = await (0, axios_1.default)(config);
    const { data, status, statusText } = response;
    console.log(`[${i}] -> ${status} ${statusText} ${data.length} Bytes`);
    const fname = url
        .replaceAll(/^https?\:\/\//gi, '')
        .replaceAll(/\?.*$/gi, '')
        .replaceAll(/\//gi, '_');
    const outPathname = path_1.default.resolve(base_path, fname);
    console.log(`[${i}] --> ${outPathname}`);
    await promises_1.default.writeFile(outPathname, data, 'utf8');
    return data;
};
exports.download = download;
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
    mkdirp.sync(base_path);
    const promises = urls.map(async (url, i) => await (0, exports.download)(i, url, base_path));
    await Promise.all(promises);
}
run();
//# sourceMappingURL=download_lisp_examples.js.map