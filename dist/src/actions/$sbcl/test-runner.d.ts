/** @format */
import { Expression, Actions } from '../../apps/runner/lib/types';
export declare const testRunner: (actions: Actions, exprJlIn: Expression, strSbclIn: string) => Promise<{
    exprJlIn: Expression;
    exprJlOut: Expression;
    ok: boolean;
    strSbclIn: string;
    strSbclOut: string;
    exprSbclOut: Expression;
}>;
