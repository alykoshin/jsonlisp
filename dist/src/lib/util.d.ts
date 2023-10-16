/** @format */
import { Parameters } from './types';
export declare const fn_check_params: (parameters: Parameters, { exactCount, minCount, typ, }: {
    exactCount?: number | number[] | undefined;
    minCount?: number | undefined;
    typ?: "string" | "number" | "array" | undefined;
}) => Parameters;
