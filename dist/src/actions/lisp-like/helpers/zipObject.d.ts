/** @format */
interface KeyValueObject<V> {
    [key: string]: V;
}
export declare function zipObject<V>(names: any[], values: V[]): KeyValueObject<V>;
export {};
