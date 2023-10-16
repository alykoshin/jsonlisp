/** @format */

import {cat} from 'shelljs';
import json5 from 'json5';

import {LogPrefix, Logger} from '../../lib/log';
import {Parameter} from '../../apps/runner/lib/types';

export function preprocess_sbcl_expr(lisp_expr: string): string {
  // escape double quotes
  lisp_expr = lisp_expr.replace(/"/g, '""');
  // replace EOLs (and spaces) with single space
  lisp_expr = lisp_expr.replace(/[ \r\n]+/g, ' ');
  lisp_expr = lisp_expr.trim();

  return lisp_expr;
}

function _get_sbcl_cmd(safe_lisp_expr: string): string {
  const cmd = 'sbcl';
  const opts = [
    `--noinform`,
    `--non-interactive`,
    `--noprint`,
    `--eval "( print ${safe_lisp_expr} )"`,
  ];
  return [cmd, ...opts].join(' ');
  // return `sbcl --noinform --non-interactive --noprint --eval "( print ${lisp_expr} )"`;
}

export function get_sbcl_cmd(lisp_expr: string): string {
  return _get_sbcl_cmd(preprocess_sbcl_expr(lisp_expr));
}
