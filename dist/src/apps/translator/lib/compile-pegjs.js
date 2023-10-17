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
exports.compileFileDir = exports.compileFileList = exports.compileSourceFileWithGrammarFile = exports.parseSourceWithGrammarFile = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const mkdirp = __importStar(require("mkdirp"));
const peggy_1 = __importStar(require("peggy"));
const fileUtils_1 = require("../../../lib/fileUtils");
const ast2jl_1 = require("./ast2jl");
const fileUtils_2 = require("../../../lib/fileUtils");
const path_1 = __importDefault(require("path"));
// export async function readGrammar(inPathname: string): Promise<string> {
// return await readStringFile(inPathname);
// }
// export async function readCompiledJsGrammar(
// pathname: string
// ): Promise<Peg$ComiledGrammar> {
/// /  const {SyntaxError, parse} = require('./src/lib/translator/grammar/lisp.js');
// const {SyntaxError, parse} = <Peg$ComiledGrammar>await readJsonFile(pathname);
// return {SyntaxError, parse};
// }
async function compileGrammarFile(base_path, grammarRelname) {
    const s_grammar = await (0, fileUtils_1.readStringFile)(path_1.default.join(base_path, grammarRelname));
    try {
        const source = peggy_1.default.generate(s_grammar, {
            output: 'source-and-map',
            grammarSource: '<generated>',
        });
        const subDir = '../out/grammar/';
        const code = source.toString();
        const jsPname = (0, fileUtils_2.makePath)(base_path, subDir, grammarRelname, '.js');
        await (0, fileUtils_1.writeStringFile)(jsPname, code);
        const sourceMap = source.toStringWithSourceMap().map.toString();
        const mapPname = (0, fileUtils_2.makePath)(base_path, subDir, grammarRelname, '.map');
        await (0, fileUtils_1.writeStringFile)(mapPname, sourceMap);
    }
    catch (e) {
        handlePegError(e);
    }
}
function handlePegError(e) {
    if (e instanceof peggy_1.GrammarError) {
        console.error('GrammarError');
        console.error(e);
    }
    else if (e instanceof SyntaxError) {
        console.error('SyntaxError');
        console.error(e);
    }
    else {
        console.error('GenericError');
        console.error(e);
        // throw e;
    }
    throw e;
}
async function parseSourceWithGrammarFile(s, grammarPathname) {
    try {
        const s_grammar = await (0, fileUtils_1.readStringFile)(grammarPathname);
        const parser = peggy_1.default.generate(s_grammar);
        const sampleOutput = parser.parse(s);
        // console.log(JSON.stringify(sampleOutput, null, 2));
        // console.log(util.inspect(sampleOutput, {depth: null}));
        return sampleOutput;
    }
    catch (e) {
        handlePegError(e);
    }
}
exports.parseSourceWithGrammarFile = parseSourceWithGrammarFile;
async function compileSourceFileWithGrammarFile(baseP, srcFname, grammarPathname) {
    //
    // LISP + Grammar -> ASR, JL/JSON, JL/JS, JL/TS
    // Read LISP Source File
    const sourcePname = (0, fileUtils_2.makePath)(baseP, '', srcFname);
    mkdirp.sync(baseP);
    const lispSource = await (0, fileUtils_1.readStringFile)(sourcePname);
    // Parse LISP Source to AST using .pegjs Grammar
    // and save AST to .json
    const parsed_ast = await parseSourceWithGrammarFile(lispSource, grammarPathname);
    const parsedOutPname = (0, fileUtils_2.makePath)(baseP, '../out/ast', srcFname, '.ast.json');
    await (0, fileUtils_1.writeJsonFile)(parsedOutPname, parsed_ast);
    // Compile AST to JL/JSON and save to file
    const compiledJson = await (0, ast2jl_1.compile_ast2jl_str_json)(parsed_ast);
    const compiledJsonPname = (0, fileUtils_2.makePath)(baseP, '../out/json', srcFname, '.jl.json');
    await (0, fileUtils_1.writeStringFile)(compiledJsonPname, compiledJson);
    // Compile AST to JL/JS and save to file
    const compiledJs = await (0, ast2jl_1.compile_ast2jl_str_js)(parsed_ast);
    const compiledJsPname = (0, fileUtils_2.makePath)(baseP, '../out/jl-js', srcFname, '.jl.js');
    await (0, fileUtils_1.writeStringFile)(compiledJsPname, compiledJs);
    // Compile AST to JL/TS and save to file
    const compiledTs = await (0, ast2jl_1.compile_ast2jl_str_ts)(parsed_ast);
    const compiledTsPname = (0, fileUtils_2.makePath)(baseP, '../out/jl-ts', srcFname, '.jl.ts');
    await (0, fileUtils_1.writeStringFile)(compiledTsPname, compiledTs);
}
exports.compileSourceFileWithGrammarFile = compileSourceFileWithGrammarFile;
async function compileFileList(compileSourceFileWithGrammarFile, base_path, sources, 
// grammarRelname: string
//grammarPathname: string,
...more) {
    // const grammarPathname = path.join(base_path, grammarRelname);
    const promises = sources.map(async (s, i) => {
        try {
            console.log(`[${i}] ${s}`);
            const res = await compileSourceFileWithGrammarFile(base_path, s, 
            // grammarPathname
            ...more);
            console.log(`[${i}]   -> DONE`);
            return res;
        }
        catch (e1) {
            throw new Error(`Error translating file "${s}"`, { cause: e1 });
        }
    });
    await Promise.all(promises);
}
exports.compileFileList = compileFileList;
async function compileFileDir(base_path, grammarPathname) {
    console.log('Compiling grammars');
    const grammars = (await promises_1.default.readdir(base_path)).filter((s) => s.endsWith('.pegjs'));
    await compileFileList(compileGrammarFile, base_path, grammars);
    const sources = (await promises_1.default.readdir(base_path)).filter((s) => s.endsWith('.lisp'));
    await compileFileList(compileSourceFileWithGrammarFile, base_path, sources, grammarPathname);
}
exports.compileFileDir = compileFileDir;
//# sourceMappingURL=compile-pegjs.js.map