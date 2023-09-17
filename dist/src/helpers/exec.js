"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
const child_process_1 = require("child_process");
// export async function execute(options: {cwd: string}, command_line: string, log: (s: number | string) => void) {
//   log(command_line);
//   const p = $$`${command_line}`;
//   if (!p || !p.stdout || !p.stderr) throw new Error('Error creating ChildProcess');
//   p.stdout.on("data", data => log(data))
//   p.stderr.on("data", data => log(data))
//   await p;
// }
async function execute(command_line, spawnOptions, execOptions) {
    return new Promise((resolve, reject) => {
        if (!execOptions.encoding)
            execOptions.encoding = 'utf8';
        if (!execOptions.timeout)
            execOptions.timeout = 0;
        spawnOptions.shell = true;
        const p = (0, child_process_1.spawn)(command_line, [], spawnOptions);
        let stdout = "";
        let stderr = "";
        if (!p || !p.stdout || !p.stderr)
            throw new Error('Error creating ChildProcess');
        p.stdout.setEncoding(execOptions.encoding); //'utf8');
        p.stderr.setEncoding(execOptions.encoding); //'utf8');
        p.stdout.on('data', function (data) {
            execOptions.log(data);
            data = data.toString();
            stdout += data;
        });
        p.stderr.on('data', function (data) {
            execOptions.log(data);
            data = data.toString();
            stderr += data;
        });
        function exit(code, signal) {
            if (code === 0) {
                // resolve({code, stdout, stderr});
                resolve(stdout.trim());
            }
            else {
                reject({ code, stdout, stderr });
            }
        }
        p.on('close', function (code) {
            execOptions.debug && execOptions.debug(`child process closed with code ${code}`);
            exit(code);
        });
        p.on('exit', function (code, signal) {
            execOptions.debug && execOptions.debug(`child process exited with code ${code} and signal ${signal}`);
            exit(code, signal);
        });
        if (execOptions.timeout !== 0) {
            setTimeout(() => {
                execOptions.log(`child process timed out in ${execOptions.timeout} ms`);
                execOptions.log(`WARN: Force kill not implemented`);
            }, execOptions.timeout);
        }
    });
}
exports.execute = execute;
//# sourceMappingURL=exec.js.map