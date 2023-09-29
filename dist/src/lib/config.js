"use strict";
/** @format */
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
exports.configWriter = exports.readActivityFile = exports.configReader = void 0;
const json5_1 = __importDefault(require("json5"));
const node_fs_1 = require("node:fs");
const fs = __importStar(require("node:fs/promises"));
const path = __importStar(require("path"));
const pkg = require('../../package.json');
function replace_extname(pathname, extname) {
    return path.join(path.dirname(pathname), path.basename(pathname, path.extname(pathname)) + extname);
}
function isDirectory(pathname) {
    try {
        return (0, node_fs_1.statSync)(pathname).isDirectory();
    }
    catch (e) {
        return false;
    }
}
function buildPathname(filename) {
    const baseDir = process.cwd();
    const pathname = path.join(baseDir, filename);
    return path.resolve(pathname);
}
const SUPPORTED_EXTENSIONS = ['.ts', '.js', '.json', '.json5'];
const INDEX_FILE_BASENAME = 'index';
class ConfigReader {
    resolveFilename(pathname) {
        // let pathname = buildPathname(fname)
        let extname = path.extname(pathname);
        if (!extname) {
            /**
             * look for 'index' file if the path to directory was passed
             */
            if (isDirectory(pathname)) {
                pathname = path.join(pathname, INDEX_FILE_BASENAME);
                // console.log(`Directory was passed; will look for 'index' file "${pathname}"`)
            }
            // console.log(`Will look for pathname "${pathname}"`)
            /**
             * try all supported extensions
             */
            for (const ext of SUPPORTED_EXTENSIONS) {
                if ((0, node_fs_1.existsSync)(pathname + ext)) {
                    extname = ext;
                    break;
                }
            }
            if (!extname) {
                const exts = SUPPORTED_EXTENSIONS.join('|');
                const msg = `Unable to find source file with any of ${exts} extnames`;
                throw new Error(msg);
            }
            pathname = pathname + extname;
        }
        console.log(`Will process as "${extname}", Final pathname: "${pathname}"`);
        return pathname;
    }
    async read(origPathname) {
        if (!origPathname)
            throw new Error('Pathname expected');
        const extname = path.extname(origPathname);
        // const baseDir = process.cwd()
        let pathname = buildPathname(origPathname);
        switch (extname) {
            case '.ts':
                return exports.configReader.readTs(pathname);
            case '.js':
                return exports.configReader.readJs(pathname);
            case '.json':
                return exports.configReader.readJson(pathname);
            case '.json5':
                return exports.configReader.readJson5(pathname);
            default:
                const msg = `Unsupported extension "${extname}" for "${origPathname}"`;
                throw new Error(msg);
        }
    }
    async readTs(pathname) {
        console.log(`Importing file "${pathname}"`);
        const data = (await Promise.resolve(`${pathname}`).then(s => __importStar(require(s)))).default;
        return data;
    }
    async readJs(pathname) {
        return this.readTs(pathname);
    }
    async readJson(pathname) {
        console.log(`Reading and parsing file "${pathname}"`);
        const content = await fs.readFile(pathname, { encoding: 'utf8' });
        return JSON.parse(content);
    }
    async readJson5(pathname) {
        console.log(`Reading and parsing file "${pathname}"`);
        const content = await fs.readFile(pathname, { encoding: 'utf8' });
        return json5_1.default.parse(content);
    }
}
exports.configReader = new ConfigReader();
async function readActivityFile(fname) {
    console.log(`Starting filename "${fname}"`);
    const pathname = exports.configReader.resolveFilename(fname);
    return exports.configReader.read(pathname);
}
exports.readActivityFile = readActivityFile;
class ConfigWriter {
    async write(config_file, config) {
        const extname = path.extname(config_file);
        const baseDir = process.cwd();
        // const pathname = path.resolve(baseDir, config_file)
        const pathname = buildPathname(config_file);
        switch (extname) {
            case '.ts':
                return exports.configWriter.writeTs(pathname, config);
            case '.json':
                return exports.configWriter.writeJson(pathname, config);
            case '.json5':
                return exports.configWriter.writeJson5(pathname, config);
        }
    }
    async writeTs(pathname, data) {
        const content = JSON.stringify(data, null, 2);
        const fullContent = `
import {FullConfig} from "./src/lib/config";

export const config: FullConfig = ${content};

export default config;
`;
        throw new Error('This may overwrite .ts file!');
        return await fs.writeFile(pathname, fullContent);
    }
    async writeJson(pathname, data) {
        const content = JSON.stringify(data, null, 2);
        return await fs.writeFile(pathname, content);
    }
    async writeJson5(pathname, data) {
        const content = json5_1.default.stringify(data, null, 2);
        return await fs.writeFile(pathname, content);
    }
}
exports.configWriter = new ConfigWriter();
//# sourceMappingURL=config.js.map