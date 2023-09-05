/// <reference types="node" />
/// <reference types="node" />
import { SpawnOptionsWithoutStdio } from 'child_process';
export declare function execute(command_line: string, spawnOptions: SpawnOptionsWithoutStdio, execOptions: {
    encoding?: BufferEncoding;
    timeout?: number;
    log: (s: number | string) => void;
    debug?: (s: number | string) => void;
}): Promise<unknown>;
