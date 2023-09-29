/** @format */

import {spawn, SpawnOptionsWithoutStdio} from 'child_process'
import {Logger, LogPrefix} from '../../../lib/log'
import {sign} from 'crypto'

// export async function execute(options: {cwd: string}, command_line: string, log: (s: number | string) => void) {
//   log(command_line);
//   const p = $$`${command_line}`;
//   if (!p || !p.stdout || !p.stderr) throw new Error('Error creating ChildProcess');
//   p.stdout.on("data", data => log(data))
//   p.stderr.on("data", data => log(data))
//   await p;
// }

type ExitCode = number | null
type ExitSignal = NodeJS.Signals | null | undefined

type ExecResult = {
  stdout: string
  stderr: string
  message: string
  code: ExitCode
  signal: ExitSignal
}

export type ExecSpawnOptions = Pick<SpawnOptionsWithoutStdio, 'cwd' | 'env'>

export async function execute(
  command_line: string,
  spawnOptions: SpawnOptionsWithoutStdio,
  execOptions: {
    encoding?: BufferEncoding
    timeout?: number
    trim?: boolean
    logger: Logger<LogPrefix>
  }
): Promise<ExecResult> {
  const defaultLogger = execOptions.logger
  const stdoutLogger = defaultLogger.new({
    name: execOptions.logger._prefix.name + '/' + 'stdout',
  })
  const stderrLogger = defaultLogger.new({
    name: execOptions.logger._prefix.name + '/' + 'stderr',
  })

  return new Promise((resolve, reject) => {
    if (!execOptions.encoding) execOptions.encoding = 'utf8'
    if (!execOptions.timeout) execOptions.timeout = 0
    if (!execOptions.trim) execOptions.trim = true

    spawnOptions.shell = true

    const p = spawn(command_line, [], spawnOptions)

    const outStreamNames = ['stdout', 'stderr'] as const

    let results: ExecResult = {
      //{[key in (typeof outStreamNames)[number]]: string} = {
      stdout: '',
      stderr: '',
      code: 0,
      signal: undefined,
      message: '',
    }

    if (!p || !p.stdout || !p.stderr) {
      throw new Error('Error creating ChildProcess')
    }

    p.stdout.setEncoding(execOptions.encoding) //'utf8');
    p.stderr.setEncoding(execOptions.encoding) //'utf8');

    p.stdout.on('data', function (data) {
      data = data.toString()
      stdoutLogger.log(data)
      results.stdout += data
    })

    p.stderr.on('data', function (data) {
      data = data.toString()
      stderrLogger.log(data)
      results.stderr += data
    })

    function debugExit(
      event: 'close' | 'exit',
      code: ExitCode,
      signal?: ExitSignal
    ) {
      let message = `[${event}] child process ${event} with code ${code}`
      if (typeof signal !== 'undefined') message += ` and signal ${signal}`
      defaultLogger.debug(message)
      results.signal = signal
      results.message = message
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
      if (execOptions.trim) {
        results.stdout = results.stdout.trim()
        results.stderr = results.stderr.trim()
      }
      // override what we set earlier with latest values
      results.code = code
      // results.message = message;
      defaultLogger.debug(`doExit`)
      if (code === 0) {
        resolve(results)
      } else {
        reject(results)
      }
    }

    //
    // At windows 'exit' triggers before `close`
    // and the the stream are not yet closed,
    // so we need to store the info and wait until `close`
    //
    p.on('exit', (code: number | null, signal: ExitSignal) => {
      debugExit('exit', code, signal)
    })

    p.on('close', (code: number | null) => {
      debugExit('close', code)
      doExit(code)
    })

    if (execOptions.timeout !== 0) {
      setTimeout(() => {
        defaultLogger.warn(
          `[timeout] child process timed out in ${execOptions.timeout} ms`
        )
        defaultLogger.warn(`WARN: Force kill not implemented`)
      }, execOptions.timeout)
    }
  })
}
