/// <reference types="node" />
export declare function removeDirRecursive(dirname: string): Promise<void>;
interface GetFilesRecursiveOptions {
    extnames: string | string[];
    excludeDirs: string | string[];
}
export declare function getFilesRecursive(startDir: string, options: GetFilesRecursiveOptions): Promise<string[]>;
export declare const writeTextFile: (fname: string, text: string, encoding?: BufferEncoding) => Promise<string[]>;
export declare const cleanup: (title: string, filenames_: string | string[]) => Promise<string[]>;
export declare const iterateFiles: (filenames: string | string[], title: string, fn: (name: string) => Promise<string | undefined>) => Promise<string[]>;
export declare const fileCheckError: (fname: string, moreData?: any) => undefined;
export declare function ensureFile(filenames: string | string[]): Promise<string[]>;
export declare function ensureNoFile(filenames: string | string[]): Promise<string[]>;
export {};
