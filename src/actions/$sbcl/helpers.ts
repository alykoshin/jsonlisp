import { LogPrefix, Logger } from "../../lib/log";

export function get_sbcl_cmd(lisp_expr: string): string {

  lisp_expr = lisp_expr.replace(/"/g, '""');

  const cmd = 'sbcl';

  const opts = [
    `--noinform`,
    `--non-interactive`,
    `--noprint`,
    `--eval "( print ${lisp_expr} )"`,
  ];

  return [cmd, ...opts].join(' ');
  // return `sbcl --noinform --non-interactive --noprint --eval "( print ${lisp_expr} )"`;
}

export function parse_sbcl_bool(lisp_bool: string, {logger}: {logger?: Logger<LogPrefix>} = {}) {
  if (lisp_bool === 'T') return true;
  else if (lisp_bool === 'NIL') return false;
  else {
    logger?.warn(`Expected LISP boolean, got "${lisp_bool}"`);
    return null;
  }
}
