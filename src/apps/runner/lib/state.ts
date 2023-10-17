/** @format */

import {EvaluateFn, Actions, Atom} from './types';

import {Scopes} from '@utilities/object';
import {Logger} from '../../../lib/log';
import {Runner} from '../runner';

export interface State {
  // name: string;
  // parameters: Parameters;
  evaluate: EvaluateFn;
  // id: number | string;
  // level: number;
  // scopes: Scopes<Atom>;
  scopes: Scopes<Atom>;
  runner: Runner;
  actions: Actions;
  logger: Logger;
}
export type EvState = Omit<State, 'evaluate'>;

// export function createState<Atom>({
//   runner,
//   scopes,
//   level,
//   name,
// }: {
//   runner: Runner;
//   scopes: Scopes<Atom>;
//   level: number;
//   name: string;
// }): EvState {
//   const state: EvState = {
//     actions: runner.actions,
//     logger: new Logger({id: runner.actionCount, level, name}),
//     runner: runner,
//     scopes: scopes,
//     // evaluate: runner.evaluate,
//   };

//   return {
//     ...state,
//   };
// }
