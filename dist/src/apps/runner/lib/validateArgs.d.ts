/** @format */
import { Parameters } from './types';
interface ValidateOptions {
    exactCount?: number | number[];
    minCount?: number;
    typ?: 'number' | 'string' | 'array';
}
export declare const validateArgs: (args: Parameters, { exactCount, minCount, typ }: ValidateOptions) => Parameters;
export {};
