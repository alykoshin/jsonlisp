/** @format */
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { SpawnOptionsWithoutStdio } from 'child_process';
import type { ILogger } from './log';
/**
 * lib/ is layer-neutral: instead of importing the Environment class, the
 * evaluation context is accepted structurally (Environment satisfies this).
 */
export interface ExecContext {
    logger: ILogger;
    'new'(): ExecContext;
    up(name: string): ExecContext;
}
export type ExecActionConfig = {
    cwd: string;
    env: {
        [key: string]: string;
    };
};
type ExitCode = number | null;
type ExitSignal = NodeJS.Signals | null | undefined;
type ExecResult = {
    stdout: string;
    stderr: string;
    message: string;
    code: ExitCode;
    signal: ExitSignal;
};
export type ExecSpawnOptions = Pick<SpawnOptionsWithoutStdio, 'cwd' | 'env'>;
export declare function execute(command_line: string, spawnOptions: SpawnOptionsWithoutStdio, execOptions: {
    encoding?: BufferEncoding;
    timeout?: number;
    trim?: boolean;
    state: ExecContext;
}): Promise<ExecResult>;
export {};
