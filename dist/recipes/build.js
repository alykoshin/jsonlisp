"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action_build = void 0;
async function action_build(definition, { id, fullConfig, runner }) {
    const command = `webpack --mode production`;
    /*
    const {base_dir, env} = actionDefinition.config;
  
    const options = {
      cwd: base_dir,
      env: env || {},
      // // stdio: 'inherit',
      // stdin: 'inherit',
      // stdout: 'pipe',
      // stderr: 'pipe',
    };
  
  
    await execute(command, options, {}, log);
  */
    const execDefinition = {
        action: 'exec',
        config: {
            ...definition.config,
            command,
        },
    };
    await runner.execute(execDefinition, fullConfig);
}
exports.action_build = action_build;
//# sourceMappingURL=build.js.map