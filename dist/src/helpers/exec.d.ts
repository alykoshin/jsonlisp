/// <reference types="node" />
/// <reference types="node" />
import { SpawnOptionsWithoutStdio } from 'child_process';
import { Logger, LogPrefix } from '../lib/log';
type ExecResult = string;
export type ExecSpawnOptions = Pick<SpawnOptionsWithoutStdio, 'cwd' | 'env'>;
export declare function execute(command_line: string, spawnOptions: SpawnOptionsWithoutStdio, execOptions: {
    encoding?: BufferEncoding;
    timeout?: number;
    logger: Logger<LogPrefix>;
}): Promise<ExecResult>;
export {};
