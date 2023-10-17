/** @format */
import {Expression, List} from '../../runner/lib/types';
import {replace_extname} from '../../../lib/fileUtils/fileUtils';
import {
  readJsonFile,
  writeJsonFile,
} from '../../../lib/fileUtils/read-write/jsonFileUtils';
import {
  readTextFile,
  writeTextFile,
} from '../../../lib/fileUtils/read-write/textFileUtils';

const astNodeType = [
  'COMMENT',
  'SYMBOL',
  'SPACE',
  'EOL',
  'KEYWORD',
  'STRING',
  'INTEGER',
  'SEQ',
  'READER',
  'READER_COMMENT',
] as const;
// 'COMMENT' | 'SYMBOL' | 'SPACE' | 'EOL' | 'KEYWORD' | 'STRING' | 'READER' | 'READER_COMMENT';

interface AstString {
  type:
    | 'COMMENT'
    | 'SYMBOL'
    | 'SPACE'
    | 'EOL'
    | 'KEYWORD'
    | 'STRING'
    | 'READER'
    | 'READER_COMMENT';
  value: string;
}

interface AstNumber {
  type: 'INTEGER';
  value: number;
}

interface AstSeq {
  type: 'SEQ';
  value: AstNode[];
}

type AstNode = AstString | AstNumber | AstSeq;

type AstTree = AstNode[];

// const AstNode2Json { [key of astNodeType]: Function} = {
//   SPACE: (node: AstString) => null,
// };

export function compile_ast2jl_obj_json(ast: AstTree): any {
  return ast.reduce<List>((acc: List, curr: AstNode) => {
    if (
      ['SYMBOL', 'INTEGER', 'KEYWORD' /* 'EOL', 'SPACE' */].includes(curr.type)
    ) {
      acc.push(curr.value);
      // } else if (['SEQ'].includes(curr.type)) {
    } else if (curr.type === 'SEQ') {
      acc.push(compile_ast2jl_obj_json(curr.value));
    } else {
      //
    }
    return acc;
  }, []);
}

function escape_chars(node: AstNode): string {
  const s = Array.isArray(node?.value) ? node?.value.join('') : node?.value;
  if (typeof s === 'string') {
    return s
      .replaceAll(/\\/gi, '\\\\')
      .replaceAll(/\n/gi, '\\n')
      .replaceAll(/\f/gi, '\\n\\n')
      .replaceAll(/"/gi, '\\"')
      .replaceAll(/\t/gi, TAB_REPLACEMENT);
    // } else if (typeof node?.value !== 'number') {
    // console.log('escape_chars error:', node);
  }
  return '';
}

//

const TAB_REPLACEMENT = '    ';
const INDENT = '  ';

export function compile_ast2jl_recurse(
  ast: AstTree,
  target: 'json' | 'js' | 'ts' | 'json5',
  state: {at_eol: boolean}
): string {
  let comma_pos = -1;
  let res = ast.reduce<string>((acc: string, curr: AstNode) => {
    const s = escape_chars(curr);
    switch (curr.type) {
      case 'SYMBOL':
      case 'KEYWORD':
        if (state.at_eol) acc += INDENT;
        state.at_eol = false;
        acc += '"' + s + '",';
        comma_pos = acc.length - 1;
        break;
      case 'STRING':
        if (state.at_eol) acc += INDENT;
        state.at_eol = false;
        acc += '"' + s + '",';
        comma_pos = acc.length - 1;
        break;
      case 'INTEGER':
        if (state.at_eol) acc += INDENT;
        state.at_eol = false;
        acc += curr.value + ',';
        comma_pos = acc.length - 1;
        break;
      case 'COMMENT':
        if (state.at_eol) acc += INDENT;
        state.at_eol = true;
        if (target === 'js' || target === 'ts' || target === 'json5') {
          acc += `// ${s}\n`;
        } else if (target === 'json') {
          acc += `[ ";", "${s}" ],\n`;
        }
        comma_pos = acc.length - 2;
        break;
      case 'READER_COMMENT':
        if (state.at_eol) acc += INDENT;
        state.at_eol = false;
        if (target === 'js' || target === 'ts' || target === 'json5') {
          acc += `/* ${s} */`;
        } else if (target === 'json') {
          acc += `[ ";", "${s}" ],`;
        }
        comma_pos = acc.length - 1;
        break;
      case 'READER':
        if (state.at_eol) acc += INDENT;
        state.at_eol = false;
        if (target === 'js' || target === 'ts' || target === 'json5') {
          acc += `/* ${s} */ \n`;
        } else if (target === 'json') {
          acc += `[ ";", "${curr.value}" ],`;
        }
        comma_pos = acc.length - 1;
        break;
      case 'EOL':
        // if (state.at_eol) acc += INDENT;
        state.at_eol = true;
        acc += curr.value;
        break;
      case 'SPACE':
        if (state.at_eol) acc += INDENT;
        state.at_eol = false;
        acc += s;
        break;
      case 'SEQ':
        if (state.at_eol) acc += INDENT;
        state.at_eol = false;
        acc += '[' + compile_ast2jl_recurse(curr.value, target, state) + '],';
        comma_pos = acc.length - 1;
        break;
      default:
      // skip
    }
    return acc;
  }, '');
  // remove last comma inside parsed string
  if (comma_pos >= 0) res = res.slice(0, comma_pos) + res.slice(comma_pos + 1);
  return res;
}

const JSON_PREFIX = '[\n';
const JSON_POSTFIX = '\n]';

export function compile_ast2jl_str_json(ast: AstTree): any {
  const res = compile_ast2jl_recurse(ast, 'json', {at_eol: true});
  return JSON_PREFIX + res + JSON_POSTFIX;
}

export function compile_ast2jl_str_json5(ast: AstTree): any {
  const res = compile_ast2jl_recurse(ast, 'json5', {at_eol: true});
  return JSON_PREFIX + res + JSON_POSTFIX;
}

const JS_PREFIX = 'const code = [\n';
const JS_POSTFIX = '\n];\n\nmodule.exports = { code }\n';

export function compile_ast2jl_str_js(ast: AstTree): any {
  const res = compile_ast2jl_recurse(ast, 'js', {at_eol: true});
  return JS_PREFIX + res + JS_POSTFIX;
}

const TS_PREFIX = 'export const code = [\n';
const TS_POSTFIX = '\n];\n\nexport default code;\n';

export function compile_ast2jl_str_ts(ast: AstTree): any {
  const res = compile_ast2jl_recurse(ast, 'ts', {at_eol: true});
  return TS_PREFIX + res + TS_POSTFIX;
}
