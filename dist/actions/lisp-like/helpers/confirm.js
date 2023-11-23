"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirm = void 0;
const keypress_1 = require("./keypress");
const confirm = async (s) => {
    const char = await (0, keypress_1.keypress)(s);
    console.log(char);
    if (char === 'Y' || char === 'y') {
        return true;
    }
    return false;
};
exports.confirm = confirm;
//# sourceMappingURL=confirm.js.map