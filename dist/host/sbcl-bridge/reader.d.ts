/** @format */
import { Parameter } from '../../eval/sexpr';
import type { ILogger } from '../../lib/log';
export declare function parse_sbcl_bool(lisp_bool: string, { logger }?: {
    logger?: ILogger;
}): boolean | null;
export declare function parse_sbcl_list(str: string, { logger }: {
    logger: ILogger;
}): Parameter;
