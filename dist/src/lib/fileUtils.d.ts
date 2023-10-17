/** @format */
export declare function replace_extname(pathname: string, new_extname: string): string;
export declare function readStringFile(inPathname: string): Promise<string>;
export declare function writeStringFile(outPathname: string, content: string): Promise<void>;
export declare function readJsonFile(inPathname: string): Promise<any>;
export declare function writeJsonFile(outPathname: string, data: any): Promise<any>;
export declare function makePath(base: string, sub: string, filename: string, extname?: string): string;
