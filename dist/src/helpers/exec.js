"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
const child_process_1 = require("child_process");
async function execute(command_line, spawnOptions, execOptions) {
    const logger = execOptions.logger;
    return new Promise((resolve, reject) => {
        if (!execOptions.encoding)
            execOptions.encoding = 'utf8';
        if (!execOptions.timeout)
            execOptions.timeout = 0;
        spawnOptions.shell = true;
        const p = (0, child_process_1.spawn)(command_line, [], spawnOptions);
        const outStreamNames = ['stdout', 'stderr'];
        let results = {
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
        function exit(event, code, signal) {
            let msg = `[${event}] child process ${event} with code ${code}`;
            if (typeof signal !== 'undefined')
                msg += ` and signal ${signal}`;
            logger.debug(msg);
            if (code === 0) {
                // resolve({code, stdout, stderr});
                resolve(results.stdout.trim());
            }
            else {
                reject({ code, ...results });
            }
        }
        p.on('close', function (code) {
            exit('close', code);
        });
        p.on('exit', function (code, signal) {
            exit('exit', code, signal);
        });
        if (execOptions.timeout !== 0) {
            setTimeout(() => {
                logger.log(`[timeout] child process timed out in ${execOptions.timeout} ms`);
                logger.warn(`WARN: Force kill not implemented`);
            }, execOptions.timeout);
        }
    });
}
exports.execute = execute;
//# sourceMappingURL=exec.js.map