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
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
//
const basic_1 = require("../basic/");
const generic_1 = require("../generic/");
const spawn_1 = require("../../helpers/spawn");
//
const MONGO_ACTIONS = {
    _backup: [
        ["$print", "Backing up database..."],
        ["$exec", "mongodump --host ${host} --port ${port}  --out \"${dir}\""],
        ["$print", "Done."],
    ],
    _restore: [
        ["$print", "Restoring database..."],
        ["$exec", "mongorestore --host ${host} --port ${port}  --dir \"${dir}\" ${ drop ? \"--drop\" : \"\"}"],
        ["$print", "Done."],
    ],
};
class MongoActivity extends generic_1.GenericActivity {
    options;
    spawn;
    basicActivity;
    constructor(options) {
        super();
        this.options = options;
        this.spawn = (0, spawn_1.Spawn)();
        this.basicActivity = new basic_1.BasicActivity(MONGO_ACTIONS);
        this.basicActivity.addMethods(this);
    }
    _getBackupDir() {
        const nowStr = (new Date()).toISOString();
        const dir = path.join(this.options.baseDir, nowStr);
        return dir;
    }
    // /**
    //  *
    //  * @param {String} host
    //  * @param {Number} port
    //  * @param {String} dir
    //  * @returns {Promise<String>}
    //  * @private
    //  */
    //async _backup({ host, port, dir }) {
    //  const cmd = `mongodump --host ${host} --port ${port}  --out "${dir}"`;
    //  return await this.spawn._spawnExecutePromised(cmd);
    //}
    async backup() {
        const dir = this._getBackupDir();
        // const res = await this._backup({
        const res = await this['_backup']({
            host: this.options.host,
            port: this.options.port,
            dir,
        });
        return dir;
    }
    // /**
    //  *
    //  * @param {String} host
    //  * @param {Number} port
    //  * @param {String} dir
    //  * @param {Boolean} drop
    //  * @returns {Promise<String>}
    //  * @private
    //  */
    //async _restore({ host, port, dir, drop }) {
    //  const dropOption = drop ? '--drop' : '';
    //  const cmd = `mongorestore --host ${host} --port ${port}  --dir "${dir}" "${dropOption}"`;
    //  return await this.spawn._spawnExecutePromised(cmd);
    //}
    async restore(dir) {
        // const result = await this._restore({
        const result = await this['_restore']({
            host: this.options.host,
            port: this.options.port,
            dir,
            drop: this.options.drop_on_restore, // ? '--drop' : '',
        });
    }
}
module.exports = MongoActivity;
//# sourceMappingURL=index.js.map