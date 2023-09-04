"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
const log_1 = require("./log");
const config_1 = require("./config");
const recipes_1 = require("../recipes/");
const chalk_1 = __importDefault(require("chalk"));
class Runner {
    actionCount = 0;
    extractAction(actionDefinition) {
        const name = Array.isArray(actionDefinition) ? actionDefinition[0] : actionDefinition.action;
        const method = recipes_1.actions[name];
        if (!method) {
            throw new Error(`Unknown action at action definition "${JSON.stringify(actionDefinition)}"`);
        }
        return { name, method };
    }
    async start(filename) {
        // const log = (s: number | string) => log_data(s, 'run_config');
        this.log(this.actionCount, `Using config file "${filename}"`);
        const fullConfig = await (0, config_1.read_config)(filename);
        this.actionCount = 0;
        await this.execute(fullConfig.execute, fullConfig);
    }
    async execute(actionConfig, fullConfig) {
        // const actionName = Array.isArray(actionConfig) ? actionConfig[0] : actionConfig.action;
        // log_data(actionName, 'run_action');
        const id = this.actionCount++;
        const { name, method } = this.extractAction(actionConfig);
        this.debug(id, `execute "${name}"`);
        await method(actionConfig, { id, fullConfig, runner: this });
    }
    log(id, s) {
        (0, log_1.log_data)(s, id);
    }
    debug(id, s) {
        (0, log_1.log_data)(chalk_1.default.grey(s), id);
    }
}
exports.Runner = Runner;
//# sourceMappingURL=runner.js.map