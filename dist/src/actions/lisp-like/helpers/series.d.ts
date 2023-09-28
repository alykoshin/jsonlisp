import { Parameter, Parameters } from '../../../lib/runner';
export declare const series: (forms: Parameters, evaluate: (parameter: Parameter) => Promise<Parameter>) => Promise<Parameters>;
export declare const seriesLast: (forms: Parameters, evaluate: (parameter: Parameter) => Promise<Parameter>) => Promise<Parameter>;
