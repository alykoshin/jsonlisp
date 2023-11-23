/** @format */
import { Expression, Actions } from '../lisp-like/helpers/types';
export declare const testRunner: (actions: Actions, exprJlIn: Expression, strSbclIn: string) => Promise<{
    exprJlIn: Expression;
    exprJlOut: Expression;
    ok: boolean;
    strSbclIn: string;
    strSbclOut: string;
    exprSbclOut: Expression;
}>;
