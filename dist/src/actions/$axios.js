"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$axios = void 0;
const axios_1 = __importDefault(require("axios"));
const types_1 = require("./lisp-like/helpers/types");
const validateArgs_1 = require("../apps/runner/lib/validateArgs");
/**
 * @module $axios
 */
/**
 * @name $axios
 */
const $axios = async function (_, args, { evaluate, logger }) {
    let [method, url, body] = (0, validateArgs_1.validateArgs)(args, { exactCount: [2, 3] });
    (0, types_1.ensureString)((method = await evaluate(method)));
    (0, types_1.ensureString)((url = await evaluate(url)));
    if (body) {
        (0, types_1.ensureString)((body = await evaluate(body)));
        try {
            body = JSON.parse(body);
        }
        catch (e) {
            throw new Error('Unable to parse body parameter, expecting stringified JSON');
        }
    }
    const config = {
        method,
        url,
        data: body,
    };
    const response = await (0, axios_1.default)(config);
    const { data, status, statusText } = response;
    logger.debug(`status: ${status} ${statusText}, data.length: ${data.length}`);
    return data;
};
exports.$axios = $axios;
const actions = {
    $axios: exports.$axios,
};
exports.default = actions;
//# sourceMappingURL=$axios.js.map