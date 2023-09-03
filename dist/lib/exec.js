"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
var child_process_1 = require("child_process");
// export async function execute(options: {cwd: string}, command_line: string, log: (s: number | string) => void) {
//   log(command_line);
//   const p = $$`${command_line}`;
//   if (!p || !p.stdout || !p.stderr) throw new Error('Error creating ChildProcess');
//   p.stdout.on("data", data => log(data))
//   p.stderr.on("data", data => log(data))
//   await p;
// }
function execute(command_line, spawnOptions, execOptions, log) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (!execOptions.encoding)
                        execOptions.encoding = 'utf8';
                    if (!execOptions.timeout)
                        execOptions.timeout = 0;
                    var p = (0, child_process_1.spawn)(command_line, spawnOptions);
                    var stdout = "";
                    var stderr = "";
                    if (!p || !p.stdout || !p.stderr)
                        throw new Error('Error creating ChildProcess');
                    p.stdout.setEncoding(execOptions.encoding); //'utf8');
                    p.stderr.setEncoding(execOptions.encoding); //'utf8');
                    p.stdout.on('data', function (data) {
                        log(data);
                        data = data.toString();
                        stdout += data;
                    });
                    p.stderr.on('data', function (data) {
                        log(data);
                        data = data.toString();
                        stderr += data;
                    });
                    p.on('close', function (code) {
                        console.log("child process closed with code ".concat(code));
                        if (code === 0) {
                            resolve({ code: code, stdout: stdout, stderr: stderr });
                        }
                        else {
                            reject({ code: code, stdout: stdout, stderr: stderr });
                        }
                    });
                    p.on('exit', function (code, signal) {
                        console.log("child process exited with code ".concat(code, " and signal ").concat(signal));
                        if (code === 0) {
                            resolve({ code: code, stdout: stdout, stderr: stderr });
                        }
                        else {
                            reject({ code: code, stdout: stdout, stderr: stderr });
                        }
                    });
                    if (execOptions.timeout !== 0) {
                        setTimeout(function () {
                            console.log("child process timed out in ".concat(execOptions.timeout, " ms"));
                            console.warn("WARN: Force kill not implemented");
                        }, execOptions.timeout);
                    }
                })];
        });
    });
}
exports.execute = execute;
// execute('dir', {shell: true,}, {}, (s) => console.log(s));
//# sourceMappingURL=exec.js.map