import { Parameter, Parameters } from '../lib/runner';

export const series = async (
  forms: Parameters,
  evaluate: (parameter: Parameter) => Promise<Parameter>
): Promise<Parameters> => {
  const result = [];
  for (const p of forms) {
    const res = await evaluate(p);
    result.push(res);
  }
  return result;
};

export const seriesLast = async (
  forms: Parameters,
  evaluate: (parameter: Parameter) => Promise<Parameter>
): Promise<Parameter> => {
  const result = await series(forms, evaluate);
  return result[result.length-1];
};
