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
exports.getConfigFilename = exports.write_config = exports.readActivityFile = exports.readToolsFile = void 0;
const node_fs_1 = require("node:fs");
const fs = __importStar(require("node:fs/promises"));
const path = __importStar(require("path"));
const json5_1 = __importDefault(require("json5"));
const pkg = require('../../package.json');
const CONFIG_MODE = '.ts'; // '.json5'; // '.json'
function buildPathname(config_file) {
    return path.join(process.cwd(), config_file);
}
async function readToolsFile(origPathname /*, extname?: string*/) {
    if (!origPathname) {
        return {};
    }
    const extname = path.extname(origPathname);
    // const fileExtname = path.extname(origPathname);
    // if (!extname) {
    //   extname = fileExtname;
    // } else {
    //
    // }
    let pathname;
    let content;
    let data;
    switch (extname) {
        case '.ts':
        case '.js':
            // pathname = path.resolve('..', origPathname)
            pathname = path.resolve(process.cwd(), origPathname);
            console.log(`Importing file "${pathname}"`);
            data = (await Promise.resolve(`${pathname}`).then(s => __importStar(require(s)))).default;
            break;
        case '.json':
            // pathname = path.resolve(__dirname, '..', origPathname)
            pathname = path.resolve(process.cwd(), origPathname);
            console.log(`Reading and parsing file "${pathname}"`);
            content = await fs.readFile(pathname, { encoding: 'utf8' });
            data = JSON.parse(content);
            break;
        case '.json5':
            // pathname = path.resolve(__dirname, '..', origPathname)
            pathname = path.resolve(process.cwd(), origPathname);
            console.log(`Reading and parsing file "${pathname}"`);
            content = await fs.readFile(pathname, { encoding: 'utf8' });
            data = json5_1.default.parse(content);
            break;
        default:
            throw new Error(`Unsupported extension "${extname}" for "${origPathname}"`);
    }
    // const pathname = options.dataFile
    // const pathname = '../'+options.dataFile
    // const a = await import(pathname)
    // console.log(`readToolsFile:`, data)
    return data;
}
exports.readToolsFile = readToolsFile;
const SUPPORTED_EXTENSIONS = [
    '.ts',
    '.js',
    '.json',
    '.json5',
];
const INDEX_FILE_BASENAME = 'index';
function isDirectory(pathname) {
    try {
        return (0, node_fs_1.statSync)(pathname).isDirectory();
    }
    catch (e) {
        return false;
    }
}
async function readActivityFile(fname) {
    console.log(`Starting filename "${fname}"`);
    let extname = path.extname(fname);
    let pathname = buildPathname(fname);
    if (!extname) {
        // look for 'index' file if the path to directory was passed
        if (isDirectory(pathname)) {
            pathname = path.join(pathname, INDEX_FILE_BASENAME);
            // console.log(`Directory was passed; will look for 'index' file "${pathname}"`)
        }
        // console.log(`Will look for pathname "${pathname}"`)
        // try all supported extensions
        for (const ext of SUPPORTED_EXTENSIONS) {
            if ((0, node_fs_1.existsSync)(pathname + ext)) {
                extname = ext;
                break;
            }
        }
        if (!extname) {
            throw new Error(`Unable to find source file with any of ${SUPPORTED_EXTENSIONS.join('|')} extnames`);
        }
        pathname = pathname + extname;
    }
    console.log(`Will process as "${extname}"`);
    pathname = path.resolve(pathname);
    console.log(`Final pathname: "${pathname}"`);
    return readToolsFile(pathname);
}
exports.readActivityFile = readActivityFile;
async function write_config(config_file, config) {
    if (CONFIG_MODE === '.ts') {
        const dataContent = JSON.stringify(config, null, 2);
        const fullContent = `
import {FullConfig} from "./src/lib/config";

export const config: FullConfig = ${dataContent};

export default config;
`;
        throw new Error('This may overwrite .ts file! and will definitely write it with wrong extension!');
        await fs.writeFile(buildPathname(config_file), fullContent);
    }
    else {
        await fs.writeFile(config_file, CONFIG_MODE === '.json5' ? json5_1.default.stringify(config, null, 2) : JSON.stringify(config, null, 2));
    }
}
exports.write_config = write_config;
function replace_extname(pathname, extname) {
    return path.join(path.dirname(pathname), path.basename(pathname, path.extname(pathname)) + extname);
}
function getConfigFilename() {
    let config_file = process.argv[2];
    if (!config_file) {
        config_file = pkg.name + (CONFIG_MODE === '.json5' ? '.json5' : CONFIG_MODE === '.json' ? '.json' : '.ts');
    }
    return config_file;
}
exports.getConfigFilename = getConfigFilename;
//# sourceMappingURL=config.js.map