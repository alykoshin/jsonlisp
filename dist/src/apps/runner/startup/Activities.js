"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activities = void 0;
const Plugins_1 = require("../../../lib/Plugins");
class Activities extends Plugins_1.Plugins {
    // async plug(name: string): Promise<Activities> {
    // const current = super.plug(name);
    // return this;
    // }
    actions() {
        // console.log('Object.keys(this.plugins):', Object.keys(this.plugins));
        const r = Object.keys(this.plugins).reduce((acc, cur) => {
            // console.log(
            //   'acc:', acc,
            //   'cur:', cur,
            //   'this.plugins[cur]:', this.plugins[cur]
            // );
            return { ...acc, ...this.plugins[cur].actions };
        }, {});
        // console.log('r:', r);
        return r;
    }
}
exports.Activities = Activities;
//# sourceMappingURL=Activities.js.map