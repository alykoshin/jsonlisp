import { Parameter } from "./runner";
export declare const fn_check_params: (parameters: Parameter | Parameter[], { exactCount, minCount, typ, }: {
    exactCount?: number | number[] | undefined;
    minCount?: number | undefined;
    typ?: "string" | "number" | "array" | undefined;
}) => void;
