"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.configWriter = exports.readActivityFile = exports.configReader = void 0;
const universalFileUtils_1 = require("../../../lib/fileUtils/read-write/universalFileUtils");
const fileUtils_1 = require("../../../lib/fileUtils/fileUtils");
class ConfigReader {
    async read(origPathname) {
        if (!origPathname)
            throw new Error('Pathname expected');
        let pathname = (0, fileUtils_1.buildPathname)(origPathname);
        return (0, universalFileUtils_1.readUniversal)(pathname);
    }
}
exports.configReader = new ConfigReader();
async function readActivityFile(fname) {
    console.log(`Starting filename "${fname}"`);
    const pathname = (0, universalFileUtils_1.resolveFilename)(fname);
    return exports.configReader.read(pathname);
}
exports.readActivityFile = readActivityFile;
class ConfigWriter {
    async write(config_file, config) {
        const pathname = (0, fileUtils_1.buildPathname)(config_file);
        return (0, universalFileUtils_1.writeUniversal)(pathname, config);
    }
}
exports.configWriter = new ConfigWriter();
//# sourceMappingURL=config.js.map