/** @format */

import {
  Parameter,
  Parameters,
  ensureList,
  ensureNumber,
  isEmptyList,
} from '../../../apps/runner/lib/types';

export function asList(p: Parameter): Parameters {
  ensureList(p);
  return p;
}

export function asNumber(p: Parameter): number {
  ensureNumber(p);
  return p;
}

export const asBoolean = (value: Parameter): boolean =>
  typeof value === 'boolean'
    ? value
    : typeof value !== 'undefined' && value !== null && !isEmptyList(value);
