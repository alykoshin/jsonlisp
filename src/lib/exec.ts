import {Execa$} from "execa";

export async function execute($$: Execa$<string>, command_line: string, log: (s: number | string) => void) {
  log(command_line);
  const p = $$`${command_line}`;
  if (!p || !p.stdout || !p.stderr) throw new Error('Error creating ChildProcess');
  p.stdout.on("data", data => log(data))
  p.stderr.on("data", data => log(data))
  await p;
}

