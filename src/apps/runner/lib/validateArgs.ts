/** @format */

import {Parameter, Parameters} from './types';

interface ValidateOptions {
  exactCount?: number | number[];
  minCount?: number;
  typ?: 'number' | 'string' | 'array';
}

export const validateArgs = (
  args: Parameters,
  {exactCount, minCount, typ}: ValidateOptions
): Parameters => {
  if (typeof args === 'undefined') {
    throw new Error('Arguments must be provided');
  }

  // default type is array
  if (typeof exactCount !== 'undefined' || typeof minCount !== 'undefined') {
    if (typeof typ === 'undefined') {
      typ = 'array';
    }
  }

  if ((typ === 'number' || typ === 'string') && typeof args !== typ) {
    throw new Error(`Expecting argument of type "${typ}"`);
  } else if (typ === 'array') {
    if (!Array.isArray(args)) {
      throw new Error(`Expecting array as argument`);
    }

    const len = args.length;

    if (
      (typeof exactCount === 'number' && len !== exactCount) ||
      (Array.isArray(exactCount) && exactCount.indexOf(len) < 0)
    ) {
      throw new Error(
        `Invalid number of arguments, expected exactly ${exactCount}, found: ${len}`
      );
    }

    if (typeof minCount !== 'undefined' && len < minCount) {
      throw new Error(
        `Invalid number of arguments, expected at least ${minCount}, found: ${len}`
      );
    }
  }
  return args;
};
