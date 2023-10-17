/** @format */
import { Logger } from '../../lib/log';
import { Parameter } from '../runner/lib/types';
export declare function parse_sbcl_bool(lisp_bool: string, { logger }?: {
    logger?: Logger;
}): boolean | null;
export declare function parse_sbcl_list(str: string, { logger }: {
    logger: Logger;
}): Parameter;
