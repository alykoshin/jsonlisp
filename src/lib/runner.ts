import {log_data} from './log'
import {read_config,FullConfig} from './config'
import {actions, ActionConfig, ActionMethod} from '../recipes/'

export async function run_config(config_filename: string) {
  const log = (s: number | string) => log_data(s, 'run_config');
  const fullConfig = await read_config(config_filename);
  const actionObj = fullConfig.execute;
  // for (const step of sequence) {
  const {action} = actionObj;
  log(action);
  await run_action(actionObj, fullConfig);
  // }
}

export async function run_action(actionConfig: ActionConfig, fullConfig: FullConfig) {
  log_data(actionConfig.action, 'run_action');
  const actionName = actionConfig.action
  const actionMethod = <ActionMethod> actions[actionName]
  if (actionMethod) {
    // switch (actionName) {
    //   case 'sequential':
    //   case 'parallel':
    //   case 'echo':
    //   case 'sleep':
    //   case 'build':
    //   case 'version':
    //   case 'zip':
    ////     await run_sequential(actionConfig, fullConfig);
    await actionMethod(actionConfig, fullConfig);
    // break;
    //
    // await build_all(actionConfig, fullConfig);
    // break;
    // await auto_version(actionConfig, fullConfig);
    // break;
    // await action_zip(actionConfig, fullConfig);
    // break;
    // default:
  } else {
    throw new Error(`Unknown action at action config "${JSON.stringify(actionConfig)}"`);
  }
}

