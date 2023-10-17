"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$copyResourcesRecursive = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const util_1 = require("../../apps/runner/lib/util");
const fsUtils_1 = require("./helpers/fsUtils");
/**
 * @module $build
 */
/**
 * @name $copyResourcesRecursive
 */
const $copyResourcesRecursive = async function (_, args, state) {
    const { runner, logger } = state;
    (0, util_1.fn_check_params)(args, { exactCount: 1 });
    const [pConfig] = args;
    const { sourceDir, excludeDirs: excludeDirs_, targetDir, } = pConfig;
    const excludeDirs = Array.isArray(excludeDirs_)
        ? excludeDirs_
        : [excludeDirs_];
    const pathnames = await (0, fsUtils_1.getFilesRecursive)(sourceDir, {
        extnames: [
            '.bmp',
            '.png',
            '.jpg',
            '.jpeg',
            '.webp',
            '.gif',
            '.svg',
            '.css',
            '.ttf',
            '.woff',
            '.woff2',
        ],
        excludeDirs,
    });
    for (let sourcePathname of pathnames) {
        const currSourceDir = path_1.default.dirname(sourcePathname);
        const currRelDir = path_1.default.relative(sourceDir, currSourceDir);
        const currTargetDir = path_1.default.resolve(targetDir, currRelDir);
        const sourceFilename = path_1.default.basename(sourcePathname);
        //const targetFilename = path.basename(sourcePathname, path.extname(sourcePathname)) + '.html';
        const targetFilename = sourceFilename; //path.basename(sourcePathname, path.extname(sourcePathname)) + '.html';
        const targetPathname = path_1.default.resolve(currTargetDir, targetFilename);
        //console.log(sourcePathname, '>>>', targetPathname);
        //
        await promises_1.default.mkdir(currTargetDir, { recursive: true });
        await promises_1.default.copyFile(sourcePathname, targetPathname);
    }
    logger.debug(`Copied ${pathnames.length} files`);
    return true;
};
exports.$copyResourcesRecursive = $copyResourcesRecursive;
//# sourceMappingURL=$copyResourcesRecursive.js.map