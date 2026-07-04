/** @format */

import {validateArgs} from '../eval/validate-args';
import {Actions, Parameters, ensureNumber} from '../eval/sexpr';

import {cond} from '../kernel/primitives';
import {NIL, asBoolean} from '../kernel/booleans';

/**
 * @module conditionals
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

  // cond: async function (action, params, {evaluate, logger}) {
  //   fn_check_params(params, {minCount: 1});

  //   for (const i in params) {
  //     const [test, ...forms] = params[i] as Parameters;
  //     const condition = await evaluate(test);
  //     // logger.debug(`cond[{$i}]: condition:`, JSON.stringify(condition));
  //     logger.debug(`cond[${i}]: condition:`, condition);
  //     if (condition) {
  //       return seriesn(forms, evaluate);
  //     }
  //   }

  //   return null;
  // },
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

  zerop: async function (_, args, {evaluate, logger}) {
    validateArgs(args, {exactCount: 1});
    const value = await evaluate(args[0]);
    ensureNumber(value);
    return evaluate(['=', value, 0]);
  },
};

export default actions;
