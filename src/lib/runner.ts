import {log_data} from './log'
import {read_config,FullConfig} from './config'
import {actions, ActionDefinition} from '../recipes/'
import chalk from "chalk";

export type ActionMethod/*<T extends ActionConfig>*/ = (
  definition: ActionDefinition/*T*/,
  {
    id,
    fullConfig,
    runner
  }: {
    id: number | string,
    fullConfig: FullConfig,
    runner: Runner
  }
) => Promise<any>

export type MultiAction = [
  action: string,
  ...actions: ActionDefinition[]
];

export class Runner {
  actionCount: number = 0;

  extractAction(actionDefinition: ActionDefinition): {name: string, method: ActionMethod} {
    const name = Array.isArray(actionDefinition) ? actionDefinition[0] : actionDefinition.action;
    const method = <ActionMethod>actions[name]
    if (!method) {
      throw new Error(`Unknown action at action definition "${JSON.stringify(actionDefinition)}"`);
    }
    return {name, method}
  }

  async start(filename: string) {
    // const log = (s: number | string) => log_data(s, 'run_config');
    this.log(this.actionCount, `Using config file "${filename}"`);
    const fullConfig = await read_config(filename);

    this.actionCount = 0;
    await this.execute(fullConfig.execute, fullConfig);
  }

  async execute(actionConfig: ActionDefinition, fullConfig: FullConfig) {
    // const actionName = Array.isArray(actionConfig) ? actionConfig[0] : actionConfig.action;
    // log_data(actionName, 'run_action');

    const id = this.actionCount++;
    const {name, method} = this.extractAction(actionConfig);
    this.debug(id, `execute "${name}"`);
    await method(actionConfig, { id, fullConfig, runner: this });
  }

  log(id: number|string, s: number|string) {
    log_data(s, id)
  }

  debug(id: number|string, s: number|string) {
    log_data(chalk.grey(s), id)
  }

}
