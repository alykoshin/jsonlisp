/** @format */
import { Atom, List, NIL } from './types';
interface KeyValueObject<V> {
    [key: string]: V | V[] | NIL;
}
export declare function passArgs(names: List, values: List): KeyValueObject<Atom>;
export {};
