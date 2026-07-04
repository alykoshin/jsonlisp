/** @format */
/**
 * @module eval/evlis
 * [model] Applicative argument-list evaluation — McCarthy's evlis.
 * `series` is the historical name in this codebase; `evlis` is the alias
 * matching the paper (see ARCHITECTURE.md).
 */
import type { State } from './environment';
import { Parameter, Parameters } from './sexpr';
export declare const series: (args: Parameters, st: State) => Promise<Parameters>;
/** McCarthy's name for it (jmc.lisp: evlis.) */
export declare const evlis: (args: Parameters, st: State) => Promise<Parameters>;
export declare const seriesnth: (index: number, args: Parameters, st: State) => Promise<Parameter>;
export declare const series1: (args: Parameters, st: State) => Promise<Parameter>;
export declare const series2: (args: Parameters, st: State) => Promise<Parameter>;
export declare const seriesn: (args: Parameters, st: State) => Promise<Parameter>;
export declare const sliceListList: (listOfLists: Parameters, pos: number) => Parameters;
