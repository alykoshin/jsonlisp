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
exports.fetchLinuxErrors = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const utils_1 = require("./utils");
async function fetchLinuxErrors(outDir) {
    const debugId = 'Linux error codes';
    const url = `https://man7.org/linux/man-pages/man3/errno.3.html`;
    const outFilename = 'linuxErrors.json';
    (0, utils_1.log)(`[${debugId}] Retrieving name/descriptions from "${url}"`);
    const response = await (0, axios_1.default)(url);
    // log(response)
    const strContent = response.data;
    // log(strContent)
    await (0, utils_1.saveString)(outDir, 'linuxErrors.html', strContent, debugId);
    const $ = cheerio.load(strContent);
    //
    // select <pre> element containing header for the list
    //
    const headerText = "List of error names";
    const selection = $(`pre:contains(${headerText})`);
    (0, utils_1.debug)(`selection.length: ${selection.length} selection[0].children.length ${selection[0].children.length}`);
    const htmlText = selection.html();
    //
    // as it is <pre> i.e. preformatted, we able to handle it line-by-line
    //
    // we can't parse it as HTML as the only way to differentiate name of the definition from the definitions itself
    // is to check if it starts at the beginning of the line;
    //
    // if we try to select all <b>name</b> we'll also retrieve the ones from inside the definitions
    //
    const lines = htmlText.split(/[\r\n]/ig);
    (0, utils_1.debug)(`lines.length: ${lines.length}`);
    const codes = {
        description: debugId,
        codes: {},
    };
    let start = false;
    let adding = false;
    let i = 0;
    let name;
    while (i < lines.length) {
        const l = lines[i];
        if (start) {
            const m = l.match(/^\s{0,8}<b>(.*)<\/b>(.*)/i);
            if (m) {
                //
                // found new error name
                //
                adding = true;
                (0, utils_1.debug)(`[${i}] [STRT] "${l}"`);
                name = m[1].trim();
                const description = m[2].trim();
                if (codes.codes[name] === undefined) {
                    codes.codes[name] = m[2].trim();
                }
                else {
                    (0, utils_1.warn)(`"${name}" already assigned to value "${codes[name]}"`);
                    const delim = (codes.codes[name] && description) ? ' ' : '';
                    codes.codes[name] = codes.codes[name] + delim + description;
                }
            }
            else if (adding) {
                //
                // iterating lines inside the description (after the name)
                //
                (0, utils_1.debug)(`[${i}] [CONT] "${l}"`);
                const description = l.trim();
                if (codes.codes[name] === undefined) {
                    (0, utils_1.warn)(`"${name}" not yet assigned`);
                    codes.codes[name] = l.trim();
                }
                else {
                    const delim = (codes.codes[name] && description) ? ' ' : '';
                    codes.codes[name] = codes.codes[name] + delim + description;
                }
            }
            else {
                (0, utils_1.debug)(`[${i}] [SKIP] "${l}"`);
            }
        }
        else if (l.indexOf(headerText) >= 0) {
            //
            // found headerText, starting to collect error names/descriptions
            //
            start = true;
        }
        else {
            // Not stared yet - skip line
        }
        i++;
    }
    (0, utils_1.log)(`[${debugId}] Collected ${Object.keys(codes.codes).length} name/description pairs.`);
    const result = (0, utils_1.getWrapperForFile)({ data: codes, url });
    await (0, utils_1.saveJson)(outDir, outFilename, result, debugId);
    return result;
}
exports.fetchLinuxErrors = fetchLinuxErrors;
//# sourceMappingURL=fetchLinuxErrors.js.map