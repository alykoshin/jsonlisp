/** @format */
import { Expression, Actions, EvaluateFn } from '../../apps/runner/lib/types';
export declare const testRunner: (exprJlIn: Expression, strSbclIn: string, { actions, evaluate }: {
    actions: Actions;
    evaluate: EvaluateFn;
}) => Promise<{
    exprJlIn: Expression;
    exprJlOut: Expression;
    ok: boolean;
    strSbclIn: string;
    strSbclOut: string;
    exprSbclOut: Expression;
}>;
