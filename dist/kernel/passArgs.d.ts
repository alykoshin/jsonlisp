/** @format */
import { Atom, List } from '../eval/sexpr';
import { NIL } from './booleans';
interface KeyValueObject<V> {
    [key: string]: V | V[] | NIL;
}
export declare function passArgs(names: List, values: List): KeyValueObject<Atom>;
export {};
