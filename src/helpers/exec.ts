import { spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { Logger, LogPrefix } from '../lib/log';
import { sign } from 'crypto';

// export async function execute(options: {cwd: string}, command_line: string, log: (s: number | string) => void) {
//   log(command_line);
//   const p = $$`${command_line}`;
//   if (!p || !p.stdout || !p.stderr) throw new Error('Error creating ChildProcess');
//   p.stdout.on("data", data => log(data))
//   p.stderr.on("data", data => log(data))
//   await p;
// }

type ExecResult = string;

export type ExecSpawnOptions = Pick<SpawnOptionsWithoutStdio, 'cwd'|'env'>

export async function execute(
  command_line: string,
  spawnOptions: SpawnOptionsWithoutStdio,
  execOptions: {
    encoding?: BufferEncoding;
    timeout?: number;
    logger: Logger<LogPrefix>;
  }
): Promise<ExecResult> {
  const logger = execOptions.logger;
  return new Promise((resolve, reject) => {
    if (!execOptions.encoding) execOptions.encoding = 'utf8';
    if (!execOptions.timeout) execOptions.timeout = 0;

    spawnOptions.shell = true;

    const p = spawn(command_line, [], spawnOptions);

    const outStreamNames = ['stdout', 'stderr'] as const;
    let results: { [key in (typeof outStreamNames)[number]]: string } = {
      stdout: '',
      stderr: '',
    };

    if (!p || !p.stdout || !p.stderr) {
      throw new Error('Error creating ChildProcess');
    }

    p.stdout.setEncoding(execOptions.encoding); //'utf8');
    p.stderr.setEncoding(execOptions.encoding); //'utf8');

    p.stdout.on('data', function (data) {
      data = data.toString();
      logger.log(`[stdout] ` + data);
      results.stdout += data;
    });

    p.stderr.on('data', function (data) {
      data = data.toString();
      logger.log(`[stderr] ` + data);
      results.stderr += data;
    });

    function exit(
      event: 'close' | 'exit',
      code: number | null,
      signal?: NodeJS.Signals | null
    ) {
      let msg = `[${event}] child process ${event} with code ${code}`;
      if (typeof signal !== 'undefined') msg += ` and signal ${signal}`;
      logger.debug(msg);
      if (code === 0) {
        // resolve({code, stdout, stderr});
        resolve(results.stdout.trim());
      } else {
        reject({ code, ...results });
      }
    }

    p.on('close', function (code: number | null) {
      exit('close', code);
    });

    p.on(
      'exit',
      function (code: number | null, signal?: NodeJS.Signals | null) {
        exit('exit', code, signal);
      }
    );

    if (execOptions.timeout !== 0) {
      setTimeout(() => {
        logger.log(
          `[timeout] child process timed out in ${execOptions.timeout} ms`
        );
        logger.warn(`WARN: Force kill not implemented`);
      }, execOptions.timeout);
    }
  });
}
