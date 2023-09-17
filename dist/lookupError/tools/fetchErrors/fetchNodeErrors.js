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
exports.fetchNodeErrors = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const utils_1 = require("./utils");
function getCommonErrors($) {
    const headerText = "Common system errors";
    const h_el = $(`section > h4:contains(${headerText}):first`);
    const h_text = h_el.text().replace(/\#/gi, '');
    // const h4_1 = $(`section > h4:contains(${headerText}):first ~ ul > li > p > code:first-child`);
    const h4_1 = $(`section > h4:contains(${headerText}):first ~ ul > li > p`);
    (0, utils_1.debug)(`selection.length: ${h4_1.length}`);
    const result = {
        description: h_text,
        codes: {},
    };
    h4_1.each((i, el) => {
        const s = $(el).text().replace(/[\r\n]+/gi, ' ');
        const m = s.match(/^(\S+) \((.*)\): (.*)/i);
        // log('match:', m)
        if (m) {
            const name = m[1];
            const short = m[2];
            const long = m[3];
            result.codes[name] = `(${short}) ${long}`;
        }
        else {
            (0, utils_1.warn)(`Unable to parse line "${s}"`);
        }
        // debug(`[${i}], "${ name }", "${ desc }"`)
    });
    (0, utils_1.log)(`[${h_text}] Collected ${Object.keys(result.codes).length} name/description pairs.`);
    return result;
}
function getMainErrors($) {
    //
    // This string matches both "Node.js error codes" and "Legacy Node.js error codes" headers
    //
    const headerText = "Node.js error codes";
    const h3_1 = $(`section > h3:contains(${headerText}):first`);
    const header1 = h3_1.text();
    const h4_1 = $(`section > h3:contains(${headerText}):first ~ h4`);
    const h3_2 = $(`section > h3:contains(${headerText}):last`);
    const header2 = h3_2.text();
    const h4_2 = $(`section > h3:contains(${headerText}):last ~ h4`);
    // debug(`selection.length: ${h4_1.length}`);
    // debug(`                  $(h3[0]).text: "${($(h4_1[0]).text())}"`);
    // debug(`                  $(h3[1]).text: "${($(h4_1[1]).text())}"`);
    const result1 = {
        description: header1,
        codes: {},
    };
    h4_1.each((i, el) => {
        let items = $(el)
            .nextUntil('h4')
            .filter((j, el) => el.name === 'p');
        const name = $(el).text().replace(/[^_0-1a-zA-Z]/gi, '');
        const desc = items.text().replace(/[\r\n]/gi, ' ');
        result1.codes[name] = desc;
        (0, utils_1.debug)(`[1-${i}] "${name}": ${desc}"`);
    });
    (0, utils_1.log)(`[${header1}] Collected ${Object.keys(result1.codes).length} name/description pairs.`);
    const result2 = {
        description: header2,
        codes: {},
    };
    h4_2.each((i, el) => {
        let items = $(el)
            .nextUntil('h4')
            .filter((j, el) => el.name === 'p');
        const name = $(el).text().replace(/[^_0-1a-zA-Z]/gi, '');
        const desc = items.text().replace(/[\r\n]/gi, ' ');
        result2.codes[name] = desc;
        (0, utils_1.debug)(`[2-${i}] "${name}": ${desc}"`);
    });
    (0, utils_1.log)(`[${header2}] Collected ${Object.keys(result2.codes).length} name/description pairs.`);
    return { codes_1: result1, codes_2: result2 };
}
async function fetchNodeErrors(outDir) {
    const url = `https://nodejs.org/dist/latest-v20.x/docs/api/errors.html`;
    const outFilename0 = 'nodeErrorsCommon.json';
    const outFilename1 = 'nodeErrors.json';
    const outFilename2 = 'nodeErrorsLegacy.json';
    const debugId = 'Node error codes';
    (0, utils_1.log)(`[${debugId}] Retrieving name/descriptions for Node errors from "${url}"`);
    //
    const response = await (0, axios_1.default)(url);
    // log(response)
    const strContent = response.data;
    // log(typeof objContent)
    await (0, utils_1.saveString)(outDir, 'nodeErrors.html', strContent, debugId);
    //
    const $ = cheerio.load(strContent);
    //
    const commonErrors = getCommonErrors($);
    const result0 = (0, utils_1.getWrapperForFile)({ data: commonErrors, url });
    await (0, utils_1.saveJson)(outDir, outFilename0, result0, commonErrors.description);
    const { codes_1, codes_2 } = getMainErrors($);
    const result1 = (0, utils_1.getWrapperForFile)({ data: codes_1, url });
    await (0, utils_1.saveJson)(outDir, outFilename1, result1, codes_1.description);
    const result2 = (0, utils_1.getWrapperForFile)({ data: codes_2, url });
    await (0, utils_1.saveJson)(outDir, outFilename2, result2, codes_2.description);
    return {
        common: commonErrors,
        errors: result1,
        legacy: result2,
    };
}
exports.fetchNodeErrors = fetchNodeErrors;
//# sourceMappingURL=fetchNodeErrors.js.map