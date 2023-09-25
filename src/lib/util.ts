import { type } from 'os';
import { Parameter } from './runner';

export const fn_check_params = (
  parameters: Parameter | Parameter[],
  {
    exactCount,
    minCount,
    typ,
  }: {
    // parameters: Parameter,
    exactCount?: number | number[];
    minCount?: number;
    typ?: 'number' | 'string' | 'array';
  }
) => {
  if (typeof parameters === 'undefined') {
    throw new Error('Parameters must be provided');
  }

  if (typeof exactCount !== 'undefined' || typeof minCount !== 'undefined') {
    if (typeof typ === 'undefined') {
      typ = 'array';
    }
  }

  if ((typ === 'number' || typ === 'string') && typeof parameters !== typ) {
    throw new Error(`Expecting parameter of type "${typ}"`);
  } else if (typ === 'array') {
    if (!Array.isArray(parameters)) {
      throw new Error(`Expecting array as parameter`);
    }

    const len = parameters.length;

    if (
      (typeof exactCount === 'number' && len !== exactCount) ||
      (Array.isArray(exactCount) && exactCount.indexOf(len) < 0)
    ) {
      throw new Error(
        `Invalid number of parameters, expected exactly ${exactCount}, found: ${len}`
      );
    }

    if (typeof minCount !== 'undefined' && len < minCount) {
      throw new Error(
        `Invalid number of parameters, expected at least ${minCount}, found: ${len}`
      );
    }
  }
};
