/** @format */
/**
 * @module eval/validate-args
 * [model] Argument-list validation used by action implementations.
 */
import { Parameters } from './sexpr';
interface ValidateOptions {
    exactCount?: number | number[];
    minCount?: number;
    typ?: 'number' | 'string' | 'array';
}
export declare const validateArgs: (args: Parameters, { exactCount, minCount, typ }: ValidateOptions) => Parameters;
export {};
