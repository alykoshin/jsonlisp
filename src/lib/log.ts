export function log_data(data: number | string, prefix = '') {
  data = data.toString()
  data.split(/\r?\n/).forEach(line => {
    const l = prefix
      ? `[${prefix}] ` + line
      : line + "\n";
    process.stdout.write(l + "\n")
  })
}

