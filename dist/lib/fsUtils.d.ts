export declare function removeDirRecursive(dirname: string): Promise<void>;
interface GetFilesRecursiveOptions {
    extnames: string | string[];
    excludeDirs: string | string[];
}
export declare function getFilesRecursive(startDir: string, options: GetFilesRecursiveOptions): Promise<string[]>;
export {};
