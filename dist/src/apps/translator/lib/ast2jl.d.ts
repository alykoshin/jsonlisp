interface AstString {
    type: 'COMMENT' | 'SYMBOL' | 'SPACE' | 'EOL' | 'KEYWORD' | 'STRING' | 'READER' | 'READER_COMMENT';
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
export declare function compile_ast2jl_obj_json(ast: AstTree): any;
export declare function compile_ast2jl_recurse(ast: AstTree, target: 'json' | 'js' | 'ts' | 'json5', state: {
    at_eol: boolean;
}): string;
export declare function compile_ast2jl_str_json(ast: AstTree): any;
export declare function compile_ast2jl_str_json5(ast: AstTree): any;
export declare function compile_ast2jl_str_js(ast: AstTree): any;
export declare function compile_ast2jl_str_ts(ast: AstTree): any;
export {};
