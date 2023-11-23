/** @format */
import { State } from '../../../apps/runner/lib/state';
import { Parameter, Parameters } from './types';
export declare const series: (args: Parameters, st: State) => Promise<Parameters>;
export declare const seriesnth: (index: number, args: Parameters, st: State) => Promise<Parameter>;
export declare const series1: (args: Parameters, st: State) => Promise<Parameter>;
export declare const series2: (args: Parameters, st: State) => Promise<Parameter>;
export declare const seriesn: (args: Parameters, st: State) => Promise<Parameter>;
export declare const sliceListList: (listOfLists: Parameters, pos: number) => Parameters;
