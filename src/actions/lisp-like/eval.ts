/** @format */

// /** @format */

// import _ from 'lodash';

// import {fn_check_params} from '../../lib/util';
// import {ActionMethodState, Actions, Atom, Parameters} from '../../lib/types';

// /**
//  * @module eval
//  */

// export const actions: Actions = {
//   /**
//    * @name eval
//    */
//   eval: async function (_, args, {evaluate, logger}) {
//     fn_check_params(args, {exactCount: 1});
//     // console.log('eval:args', JSON.stringify(args));
//     const inner = await evaluate(args[0]);
//     // console.log('eval:inner:', JSON.stringify(inner));
//     const res = await evaluate(inner);
//     // console.log('eval:res:', JSON.stringify(res));
//     return res;
//   },
// };

// export default actions;
