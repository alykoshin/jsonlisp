/** @format */
import { Parameter, Parameters } from '../../../lib/types';
export declare const series: (forms: Parameters, evaluate: (parameter: Parameter) => Promise<Parameter>) => Promise<Parameters>;
export declare const seriesnth: (index: number, forms: Parameters, evaluate: (parameter: Parameter) => Promise<Parameter>) => Promise<Parameter>;
export declare const series1: (forms: Parameters, evaluate: (parameter: Parameter) => Promise<Parameter>) => Promise<Parameter>;
export declare const series2: (forms: Parameters, evaluate: (parameter: Parameter) => Promise<Parameter>) => Promise<Parameter>;
export declare const seriesn: (forms: Parameters, evaluate: (parameter: Parameter) => Promise<Parameter>) => Promise<Parameter>;
