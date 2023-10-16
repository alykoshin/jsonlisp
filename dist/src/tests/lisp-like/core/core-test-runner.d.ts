/** @format */
import { GenericList } from '../../../lib/types';
type MinimalAtom = boolean | number | string;
type MinimalList = GenericList<MinimalAtom>;
type SbclExpression = string;
export type TestCase = [MinimalList, SbclExpression];
export {};
