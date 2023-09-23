import { LogPrefix, Logger } from "../../lib/log";
export declare function get_sbcl_cmd(lisp_expr: string): string;
export declare function parse_sbcl_bool(lisp_bool: string, { logger }?: {
    logger?: Logger<LogPrefix>;
}): boolean | null;
