/** @format */
import { List } from '../../eval/sexpr';
type SbclExpression = string;
export type TestCase = [List, SbclExpression, message?: string];
export {};
