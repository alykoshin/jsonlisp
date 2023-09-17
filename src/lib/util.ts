import {Parameter} from "./runner";

export const fn_check_params = (parameters: Parameter[], {exactCount, minCount}: {
  // parameters: Parameter,
  exactCount?: number | number[],
  minCount?: number,
}) => {
  if (!parameters) throw new Error('Parameters must be provided');
  if (!Array.isArray(parameters)) throw new Error('Parameters must be an array');
  const len = parameters.length
  if (
    (typeof exactCount === 'number' && len !== exactCount) ||
    (Array.isArray(exactCount) && exactCount.indexOf(len) < 0)
  )
    throw new Error(`Invalid number of parameters, expected exactly ${exactCount}, found: ${len}`);
  if (typeof minCount !== 'undefined' && len < minCount)
    throw new Error(`Invalid number of parameters, expected at least ${minCount}, found: ${len}`);
};

