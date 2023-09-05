export declare function removeDirRecursive(dirname: string): Promise<void>;
export declare function getFilesRecursive(startDir: string, { extnames, excludeDirs }: {
    extnames: string[];
    excludeDirs: string[];
}): Promise<string[]>;
