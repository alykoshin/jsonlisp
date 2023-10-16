/** @format */

import {Parameter, Parameters} from '../../../apps/runner/lib/types';
import {fn_check_params} from '../../../apps/runner/lib/util';

// export const lengthEqual = (lists: any[]): boolean =>
//   lists.every((l) => lists[0].length === l.length);

//

export const series = async (
  forms: Parameters,
  evaluate: (parameter: Parameter) => Promise<Parameter>
): Promise<Parameters> => {
  fn_check_params(forms, {minCount: 0});
  const result = [];
  for (const p of forms) {
    const res = await evaluate(p);
    result.push(res);
  }
  return result;
};

export const seriesnth = async (
  index: number,
  forms: Parameters,
  evaluate: (parameter: Parameter) => Promise<Parameter>
): Promise<Parameter> => {
  const result = await series(forms, evaluate);
  if (index < 0) {
    index = result.length - 1;
  }
  fn_check_params(result, {minCount: index});
  return result[index];
};

export const series1 = async (
  forms: Parameters,
  evaluate: (parameter: Parameter) => Promise<Parameter>
): Promise<Parameter> => {
  return seriesnth(0, forms, evaluate);
};

export const series2 = async (
  forms: Parameters,
  evaluate: (parameter: Parameter) => Promise<Parameter>
): Promise<Parameter> => {
  return seriesnth(1, forms, evaluate);
};

export const seriesn = async (
  forms: Parameters,
  evaluate: (parameter: Parameter) => Promise<Parameter>
): Promise<Parameter> => {
  return seriesnth(-1, forms, evaluate);
};
