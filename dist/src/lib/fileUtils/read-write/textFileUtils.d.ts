/** @format */
/// <reference types="node" />
export declare function readTextFile(pathname: string, encoding?: BufferEncoding): Promise<string>;
export declare const writeTextFile: (pathname: string, content: string, encoding?: BufferEncoding) => Promise<void>;
