/** @format */
import { Atom, List, NIL } from '../../../apps/runner/lib/types';
interface KeyValueObject<V> {
    [key: string]: V | V[] | NIL;
}
export declare function passArgs(names: List, values: List): KeyValueObject<Atom>;
export {};
