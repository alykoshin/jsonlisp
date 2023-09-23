import { Parameter } from "./runner";
export declare const fn_check_params: (parameters: Parameter[], { exactCount, minCount }: {
    exactCount?: number | number[] | undefined;
    minCount?: number | undefined;
}) => void;
