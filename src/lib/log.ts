import chalk from "chalk";

export function log_data(data: number | string, prefix: number | string = '') {
  data = data.toString()
  data
    .split(/\r?\n/)
    .forEach(line => {
      const l = typeof prefix !== 'undefined'
        ? chalk.grey(`[${prefix}] `) + line
        : line;
      process.stdout.write(l + "\n")
    })
}

