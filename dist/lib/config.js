"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigFilename = exports.write_config = exports.read_config = void 0;
const fs = __importStar(require("node:fs/promises"));
const json5_1 = __importDefault(require("json5"));
const path = __importStar(require("path"));
const pkg = require('../../package.json');
const CONFIG_MODE = 'json5'; // 'json'
async function read_config(config_file) {
    const content = await fs.readFile(config_file, { encoding: 'utf8' });
    return CONFIG_MODE === 'json5' ? json5_1.default.parse(content) : JSON.parse(content);
}
exports.read_config = read_config;
async function write_config(config_file, config) {
    await fs.writeFile(config_file, CONFIG_MODE === 'json5' ? json5_1.default.stringify(config, null, 2) : JSON.stringify(config, null, 2));
}
exports.write_config = write_config;
function replace_extname(pathname, extname) {
    return path.join(path.dirname(pathname), path.basename(pathname, path.extname(pathname)) + extname);
}
function getConfigFilename() {
    // log_data('process.argv:', process.argv)
    let config_file = process.argv[2];
    if (!config_file) {
        config_file = pkg.name + (CONFIG_MODE === 'json5' ? '.json5' : '.json');
    }
    return config_file;
}
exports.getConfigFilename = getConfigFilename;
//# sourceMappingURL=config.js.map