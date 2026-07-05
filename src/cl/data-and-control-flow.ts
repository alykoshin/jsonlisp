/** @format */

import {validateArgs} from '../eval/validate-args';
import {Actions, ensureString} from '../eval/sexpr';
import {series1, series2, seriesn} from '../eval/evlis';
import {stringify} from '../eval/printer';

import {cond} from '../kernel/primitives';
import {NIL, asBoolean} from '../kernel/booleans';
import {operators} from './numbers';

/**
 * @module cl/data-and-control-flow
 * CLHS chapter 5 "Data and Control Flow": if/when/unless/cond, setq,
 * prog1/prog2/progn, and/or/not.
 */

export const actions: Actions = {
  /** @name if */
  if: async function (_, args, {evaluate, logger}) {
    validateArgs(args, {exactCount: [2, 3]});
    // NB: the earlier implementation selected branches via
    // ["first"/"second"/"third", ["quote", args]] and depended on those
    // accessors RE-EVALUATING the extracted element; with car/cdr owned by
    // the kernel (data semantics, CL-correct) `if` evaluates its own branch.
    const [pTest, pThen, pElse] = args;

    const condition = asBoolean(await evaluate(pTest));
    logger.debug(`if: condition: ` + JSON.stringify(condition));

    const branch = condition ? pThen : pElse;
    if (typeof branch !== 'undefined') {
      return await evaluate(branch);
    }
    return NIL;
  },

  cond,

  /** @name when */
  when: async function (_, args, {evaluate, logger}) {
    validateArgs(args, {exactCount: 2});
    const [testClause, actionWhenTrue] = args;

    const condition = await evaluate(testClause);
    logger.debug(`when: condition: ` + JSON.stringify(condition));

    if (condition) {
      return await evaluate(actionWhenTrue);
    }

    return null;
  },

  /** @name unless */
  unless: async function (_, args, {evaluate, logger}) {
    validateArgs(args, {exactCount: 2});
    const [testClause, actionWhenFalse] = args;

    const condition = await evaluate(testClause);
    logger.debug(`unless: condition: ` + JSON.stringify(condition));

    if (!condition) {
      return await evaluate(actionWhenFalse);
    }

    return null;
  },

  /**
   * @name setq
   * @see
   * Difference between `set`, `setq`, and `setf` in Common Lisp?
   * {@link https://stackoverflow.com/questions/869529/difference-between-set-setq-and-setf-in-common-lisp}
   */
  setq: async function (_, args, {evaluate, scopes, logger}) {
    validateArgs(args, {exactCount: 2});

    // CL: setq does NOT evaluate the variable name. (Evaluating it made any
    // re-setq of a bound variable crash: "res" -> current value -> not a
    // string. Use `set` semantics separately if a computed name is needed.)
    const name = args[0];
    ensureString(name, `Expect string as a name of variable`);

    const value = await evaluate(args[1]);

    // creates variable at local scope
    scopes.current().set(name, value);

    logger.debug(`${name} = ${stringify(value)}`);
    return value;
  },

  /**
   * @name set
   * CL: unlike setq, `set` EVALUATES the name — for computed variable
   * names: (setq nm 'dyn) (set nm 42) assigns to `dyn`.
   */
  set: async function (_, args, {evaluate, scopes, logger}) {
    validateArgs(args, {exactCount: 2});

    const name = await evaluate(args[0]);
    ensureString(name, `Expect string as a name of variable`);

    const value = await evaluate(args[1]);

    scopes.current().set(name, value);

    logger.debug(`${name} = ${stringify(value)}`);
    return value;
  },

  /** @name prog1 */
  prog1: async function (_, args, st) {
    return series1(args, st);
  },

  /** @name prog2 */
  prog2: async function (_, args, st) {
    return series2(args, st);
  },

  /** @name progn */
  progn: async function (_, args, st) {
    return seriesn(args, st);
  },

  /** @name and */
  and: operators,
  /** @name or */
  or: operators,
  /** @name not */
  not: operators,
};

export default actions;
