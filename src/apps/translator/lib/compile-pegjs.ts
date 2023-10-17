/** @format */

import fs from 'fs/promises';
import * as mkdirp from 'mkdirp';
import peggy, {GrammarError} from 'peggy';
import {replace_extname} from '../../../lib/fileUtils/fileUtils';
import {writeJsonFile} from '../../../lib/fileUtils/read-write/jsonFileUtils';
import {
  readTextFile,
  writeTextFile,
} from '../../../lib/fileUtils/read-write/textFileUtils';
import {readJsonFile} from '../../../lib/fileUtils/read-write/jsonFileUtils';
import {
  compile_ast2jl_str_js,
  compile_ast2jl_str_json,
  compile_ast2jl_str_ts,
} from './ast2jl';
import {makePath} from '../../../lib/fileUtils/fileUtils';
import path from 'path';
import {mkdir} from 'fs';

type Peg$Location = {
  source: string;
  start: {
    offset: number;
    line: number;
    column: number;
  };
  end: {
    offset: number;
    line: number;
    column: number;
  };
};

type Peg$SyntaxError = (
  message: string,
  expected: string,
  found: string,
  location: Peg$Location
) => Error;
type Peg$Parse = (
  input: string,
  options?: peggy.ParserOptions | undefined
) => any;

interface Peg$ComiledGrammar {
  SyntaxError: Peg$SyntaxError;
  parse: Peg$Parse;
}

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

async function compileGrammarFile(
  base_path: string,
  grammarRelname: string
): Promise<void> {
  const s_grammar = await readTextFile(path.join(base_path, grammarRelname));
  try {
    const source = peggy.generate(s_grammar, {
      output: 'source-and-map',
      grammarSource: '<generated>',
    });

    const subDir = '../out/grammar/';

    const code = source.toString();
    const jsPname = makePath(base_path, subDir, grammarRelname, '.js');
    await writeTextFile(jsPname, code);

    const sourceMap = source.toStringWithSourceMap().map.toString();
    const mapPname = makePath(base_path, subDir, grammarRelname, '.map');
    await writeTextFile(mapPname, sourceMap);
  } catch (e) {
    handlePegError(e as Error);
  }
}

function handlePegError(e: Error): void {
  if (e instanceof GrammarError) {
    console.error('GrammarError');
    console.error(e);
  } else if (e instanceof SyntaxError) {
    console.error('SyntaxError');
    console.error(e);
  } else {
    console.error('GenericError');
    console.error(e);
    // throw e;
  }
  throw e;
}

export async function parseSourceWithGrammarFile(
  s: string,
  grammarPathname: string
): Promise<any> {
  try {
    const s_grammar = await readTextFile(grammarPathname);
    const parser = peggy.generate(s_grammar);
    const sampleOutput = parser.parse(s);
    // console.log(JSON.stringify(sampleOutput, null, 2));
    // console.log(util.inspect(sampleOutput, {depth: null}));
    return sampleOutput;
  } catch (e) {
    handlePegError(e as Error);
  }
}

export async function compileSourceFileWithGrammarFile(
  baseP: string,
  srcFname: string,
  grammarPathname: string
): Promise<void> {
  //
  // LISP + Grammar -> ASR, JL/JSON, JL/JS, JL/TS

  // Read LISP Source File

  const sourcePname = makePath(baseP, '', srcFname);
  mkdirp.sync(baseP);
  const lispSource = await readTextFile(sourcePname);

  // Parse LISP Source to AST using .pegjs Grammar
  // and save AST to .json

  const parsed_ast = await parseSourceWithGrammarFile(
    lispSource,
    grammarPathname
  );
  const parsedOutPname = makePath(baseP, '../out/ast', srcFname, '.ast.json');
  await writeJsonFile(parsedOutPname, parsed_ast);

  // Compile AST to JL/JSON and save to file

  const compiledJson = await compile_ast2jl_str_json(parsed_ast);
  const compiledJsonPname = makePath(
    baseP,
    '../out/json',
    srcFname,
    '.jl.json'
  );
  await writeTextFile(compiledJsonPname, compiledJson);

  // Compile AST to JL/JS and save to file

  const compiledJs = await compile_ast2jl_str_js(parsed_ast);
  const compiledJsPname = makePath(baseP, '../out/jl-js', srcFname, '.jl.js');
  await writeTextFile(compiledJsPname, compiledJs);

  // Compile AST to JL/TS and save to file

  const compiledTs = await compile_ast2jl_str_ts(parsed_ast);
  const compiledTsPname = makePath(baseP, '../out/jl-ts', srcFname, '.jl.ts');
  await writeTextFile(compiledTsPname, compiledTs);
}

export async function compileFileList(
  compileSourceFileWithGrammarFile: Function,
  base_path: string,
  sources: string[],
  // grammarRelname: string
  //grammarPathname: string,
  ...more: any
) {
  // const grammarPathname = path.join(base_path, grammarRelname);
  const promises = sources.map(async (s, i) => {
    try {
      console.log(`[${i}] ${s}`);
      const res = await compileSourceFileWithGrammarFile(
        base_path,
        s,
        // grammarPathname
        ...more
      );
      console.log(`[${i}]   -> DONE`);
      return res;
    } catch (e1) {
      throw new Error(`Error translating file "${s}"`, {cause: e1});
    }
  });
  await Promise.all(promises);
}

export async function compileFileDir(
  base_path: string,
  grammarPathname: string
) {
  console.log('Compiling grammars');
  const grammars = (await fs.readdir(base_path)).filter((s) =>
    s.endsWith('.pegjs')
  );
  await compileFileList(compileGrammarFile, base_path, grammars);

  const sources = (await fs.readdir(base_path)).filter((s) =>
    s.endsWith('.lisp')
  );
  await compileFileList(
    compileSourceFileWithGrammarFile,
    base_path,
    sources,
    grammarPathname
  );
}
