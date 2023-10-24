/** @format */

import {spawn, SpawnOptionsWithoutStdio} from 'child_process';
import {State} from '../../../apps/runner/lib/state';

// export async function execute(options: {cwd: string}, command_line: string, log: (s: number | string) => void) {
//   log(command_line);
//   const p = $$`${command_line}`;
//   if (!p || !p.stdout || !p.stderr) throw new Error('Error creating ChildProcess');
//   p.stdout.on("data", data => log(data))
//   p.stderr.on("data", data => log(data))
//   await p;
// }

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

export async function execute(
  command_line: string,
  spawnOptions: SpawnOptionsWithoutStdio,
  execOptions: {
    encoding?: BufferEncoding;
    timeout?: number;
    trim?: boolean;
    state: State;
  }
): Promise<ExecResult> {
  let {encoding, timeout, trim, state} = execOptions;

  const lgrs = {
    default: state.new().up('exec').logger, //.new({
    // ...state,
    // name: state.logger.state.name + '/' + 'exec',
    // }),
    stdout: state.new().up('exec:stdout').logger,
    // stdout: state.logger.new({
    //   ...state,
    //   name: state.logger.state.name + '/' + 'exec:stdout',
    // }),
    stderr: state.new().up('exec:stderr').logger,
    // stderr: state.logger.new({
    //   ...state,
    //   name: state.logger.state.name + '/' + 'exec:stderr',
    // }),
  };

  return new Promise((resolve, reject) => {
    if (!encoding) encoding = 'utf8';
    if (!timeout) timeout = 0;
    if (!trim) trim = true;
    lgrs.default.log(
      `command_line: "${command_line}", spawnOptions:`,
      spawnOptions
    );

    spawnOptions.shell = true;

    const p = spawn(command_line, [], spawnOptions);

    const outStreamNames = ['stdout', 'stderr'] as const;

    let results: ExecResult = {
      //{[key in (typeof outStreamNames)[number]]: string} = {
      stdout: '',
      stderr: '',
      code: 0,
      signal: undefined,
      message: '',
    };

    if (!p || !p.stdout || !p.stderr) {
      throw new Error('Error creating ChildProcess');
    }

    p.stdout.setEncoding(encoding); //'utf8');
    p.stderr.setEncoding(encoding); //'utf8');

    p.stdout.on('data', function (data) {
      data = data.toString();
      lgrs.stdout.log(data);
      results.stdout += data;
    });

    p.stderr.on('data', function (data) {
      data = data.toString();
      lgrs.stderr.log(data);
      results.stderr += data;
    });

    function debugExit(
      event: 'close' | 'exit',
      code: ExitCode,
      signal?: ExitSignal
    ) {
      let message = `[${event}] child process ${event} with code ${code}`;
      if (typeof signal !== 'undefined') message += ` and signal ${signal}`;
      if (code !== 0) lgrs.default.warn(message);
      else lgrs.default.debug(message);
      results.signal = signal;
      results.message = message;
    }

    function doExit(
      // event: 'close' | 'exit',
      // code,
      // message = '',
      // signal,
      // }: {
      // event: 'close' | 'exit',
      code: number | null
      // message: string;
      // signal: ExitSignal;
      // }
    ) {
      if (trim) {
        results.stdout = results.stdout.trim();
        results.stderr = results.stderr.trim();
      }
      // override what we set earlier with latest values
      results.code = code;
      // results.message = message;
      lgrs.default.debug(`doExit`);
      if (code === 0) {
        resolve(results);
      } else {
        reject(results);
      }
    }

    //
    // At windows 'exit' triggers before `close`
    // and the the stream are not yet closed,
    // so we need to store the info and wait until `close`
    //
    p.on('exit', (code: number | null, signal: ExitSignal) => {
      debugExit('exit', code, signal);
    });

    p.on('close', (code: number | null) => {
      debugExit('close', code);
      doExit(code);
    });

    if (timeout !== 0) {
      setTimeout(() => {
        lgrs.default.warn(`[timeout] child process timed out in ${timeout} ms`);
        lgrs.default.warn(`WARN: Force kill not implemented`);
      }, timeout);
    }
  });
}
