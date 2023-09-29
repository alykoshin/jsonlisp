"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
const child_process_1 = require("child_process");
async function execute(command_line, spawnOptions, execOptions) {
    const defaultLogger = execOptions.logger.new({
        name: execOptions.logger._prefix.name + '/' + 'execute',
    });
    const stdoutLogger = defaultLogger.new({
        name: execOptions.logger._prefix.name + '/' + 'stdout',
    });
    const stderrLogger = defaultLogger.new({
        name: execOptions.logger._prefix.name + '/' + 'stderr',
    });
    return new Promise((resolve, reject) => {
        if (!execOptions.encoding)
            execOptions.encoding = 'utf8';
        if (!execOptions.timeout)
            execOptions.timeout = 0;
        if (!execOptions.trim)
            execOptions.trim = true;
        defaultLogger.debug(command_line, spawnOptions);
        spawnOptions.shell = true;
        const p = (0, child_process_1.spawn)(command_line, [], spawnOptions);
        const outStreamNames = ['stdout', 'stderr'];
        let results = {
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
        p.stdout.setEncoding(execOptions.encoding); //'utf8');
        p.stderr.setEncoding(execOptions.encoding); //'utf8');
        p.stdout.on('data', function (data) {
            data = data.toString();
            stdoutLogger.log(data);
            results.stdout += data;
        });
        p.stderr.on('data', function (data) {
            data = data.toString();
            stderrLogger.log(data);
            results.stderr += data;
        });
        function debugExit(event, code, signal) {
            let message = `[${event}] child process ${event} with code ${code}`;
            if (typeof signal !== 'undefined')
                message += ` and signal ${signal}`;
            defaultLogger.debug(message);
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
        code
        // message: string;
        // signal: ExitSignal;
        // }
        ) {
            if (execOptions.trim) {
                results.stdout = results.stdout.trim();
                results.stderr = results.stderr.trim();
            }
            // override what we set earlier with latest values
            results.code = code;
            // results.message = message;
            defaultLogger.debug(`doExit`);
            if (code === 0) {
                resolve(results);
            }
            else {
                reject(results);
            }
        }
        //
        // At windows 'exit' triggers before `close`
        // and the the stream are not yet closed,
        // so we need to store the info and wait until `close`
        //
        p.on('exit', (code, signal) => {
            debugExit('exit', code, signal);
        });
        p.on('close', (code) => {
            debugExit('close', code);
            doExit(code);
        });
        if (execOptions.timeout !== 0) {
            setTimeout(() => {
                defaultLogger.warn(`[timeout] child process timed out in ${execOptions.timeout} ms`);
                defaultLogger.warn(`WARN: Force kill not implemented`);
            }, execOptions.timeout);
        }
    });
}
exports.execute = execute;
//# sourceMappingURL=exec.js.map