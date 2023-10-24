/** @format */
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { SpawnOptionsWithoutStdio } from 'child_process';
import { State } from '../../../apps/runner/lib/state';
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
    state: State;
}): Promise<ExecResult>;
export {};
