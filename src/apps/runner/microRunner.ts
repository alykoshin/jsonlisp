/** @format */

import {
  Actions,
  Parameter,
  Parameters,
  isAtom,
  isList,
  isEmptyList,
  ensureList_logger,
  Atom,
  GenericList,
  ensureFunction,
  ActionListExecutor as ListExecutor,
  Expression,
  ensureString,
  List,
  ensureList,
  isSymbol,
  isString,
  ActionMethodState,
} from './lib/types';

import {LogPrefix, Logger} from '../../lib/log';
import {Scopes} from '@utilities/object';

import {series} from '../../actions/lisp-like/helpers/series';
import {
  GenericActionMethodState,
  GenericInterpreter,
} from './lib/GenericInterpreter';
import {execAction} from '../../actions/lisp-like/helpers/actions';
import curry from '../../lib/curry';

export type MicroAtom = boolean | number | string;
export type MicroList = GenericList<MicroAtom>;

// export interface ListExecutorMap {
// [name: string]: ListExecutor;
// }

export class MicroInterpreter extends GenericInterpreter {
  actions: Actions;

  constructor({actions}: {actions: Actions}) {
    super();
    this.actions = actions;
    // this.microEvaluate = this.microEvaluate.bind(this)
  }

  async evaluate(
    expr: Expression,
    state?: ActionMethodState<MicroAtom>
  ): Promise<Parameter> {
    if (!state) {
      const DEBUG_LEVEL = 'debug'; //'info';
      const logger = new Logger({id: 0, level: 0, name: 'micro'}, DEBUG_LEVEL);
      const initialState: ActionMethodState<MicroAtom> = {
        runner: this,
        actions: this.actions,
        // name: '',
        scopes: new Scopes<MicroAtom>(),
        logger,
        evaluate: (expr: Expression) => this.evaluate(expr, initialState),
      };
      state = {...initialState};
    } else {
      const newState: ActionMethodState<MicroAtom> = {
        ...state,
        logger: state.logger.newUp(),
      };
    }
    // const evl = async (p: Parameter) => await this.evaluate(p, state);
    // state.evaluate = evl;
    state.evaluate = curry(this.evaluate, state);

    // const EVAL_FN_NAME = 'eval';
    // const fn = this.actions[EVAL_FN_NAME];
    // ensureFunction(fn, `function "${EVAL_FN_NAME}" not defined`);
    // const res = (fn as Function)(EVAL_FN_NAME, [expr], state);
    // return res;

    // // prettier-ignore
    return await execAction<MicroAtom>('eval', expr, state);
  }
}
