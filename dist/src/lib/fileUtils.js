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
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePath = exports.writeJsonFile = exports.readJsonFile = exports.writeStringFile = exports.readStringFile = exports.replace_extname = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
// import * as // import {PeggySyntaxError, parse} from './resources/lisp';
// import {PeggySyntaxError, parse} from './resources/grammar';
const mkdirp = __importStar(require("mkdirp"));
// import path from 'path';
// import path from 'path';
// import {PeggySyntaxError, parse} from './resources/lisp';
// import {PeggySyntaxError, parse} from './resources/grammar';
function replace_extname(pathname, new_extname) {
    const old_extname = path.extname(pathname);
    const basename = path.basename(pathname, old_extname);
    const dirname = path.dirname(pathname);
    return path.join(dirname, basename + new_extname);
}
exports.replace_extname = replace_extname;
async function readStringFile(inPathname) {
    return await fs.readFile(inPathname, { encoding: 'utf8' });
}
exports.readStringFile = readStringFile;
async function writeStringFile(outPathname, content) {
    await fs.writeFile(outPathname, content, {
        encoding: 'utf8',
    });
}
exports.writeStringFile = writeStringFile;
async function readJsonFile(inPathname) {
    // return require(pathname);
    const s = await readStringFile(inPathname);
    console.log(`readJsonFile: s:`, s);
    try {
        return JSON.parse(s);
    }
    catch (e1) {
        throw new Error(`Unable to parse JSON from file "${inPathname}"`, {
            cause: e1,
        });
    }
}
exports.readJsonFile = readJsonFile;
async function writeJsonFile(outPathname, data) {
    await writeStringFile(outPathname, JSON.stringify(data, null, 2));
}
exports.writeJsonFile = writeJsonFile;
function makePath(base, sub, filename, extname) {
    if (extname)
        filename = replace_extname(filename, extname);
    const p = path.resolve(base, sub);
    mkdirp.sync(p);
    return path.resolve(p, filename);
}
exports.makePath = makePath;
//# sourceMappingURL=fileUtils.js.map