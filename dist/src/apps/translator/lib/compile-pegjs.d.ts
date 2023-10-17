/** @format */
export declare function parseSourceWithGrammarFile(s: string, grammarPathname: string): Promise<any>;
export declare function compileSourceFileWithGrammarFile(baseP: string, srcFname: string, grammarPathname: string): Promise<void>;
export declare function compileFileList(compileSourceFileWithGrammarFile: Function, base_path: string, sources: string[], ...more: any): Promise<void>;
export declare function compileFileDir(base_path: string, grammarPathname: string): Promise<void>;
