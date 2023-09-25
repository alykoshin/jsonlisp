import Ajv, { Schema, JSONSchemaType, ValidateFunction } from 'ajv';
import { fn_check_params } from '../../lib/util';
import {
  ActionMethodState,
  Actions,
  AtomDefinition,
  Parameter,
  Parameters,
} from '../../lib/runner';

type ActionArg = // undefined |

    | boolean
    | number
    | bigint
    | string
    | symbol
    // null |
    | Object;

// type ActionList = [
// ActionName,
// ...more: ActionArg[]
// ]

// const schema: JSONSchemaType<string> = {
// const schema: Schema = {
//   type: 'array',
//   minItems: 1,
//   maxItems: Number.MAX_SAFE_INTEGER,
//   items: {
//     // oneOf: [
//     // {
//     type: ['boolean', 'number', /*'bigint', */ 'string', 'object'],
//     // },
//     // {
//     //   type: ['object'],
//     //   // type: 'object',
//     //   // required: ['label', 'value'],
//     //   // properties: {
//     //   // }
//     // },
//     // ]
//   },
// };

// const ajv = new Ajv({ allowUnionTypes: true });
// let validate: ValidateFunction<Parameter> = ajv.compile(schema);
// const data = {
//   foo: 1,
//   bar: 'abc',
// };

// if (validate(data)) {
//   // data is MyData here
//   console.log(data.foo);
// } else {
//   console.log(validate.errors);
// }

export const actions: Actions = {
  $parallel: async function $parallel(action, params, { evaluate, logger }) {
    fn_check_params(params, { minCount: 2 });
    const promises = params.map((a) => evaluate(a));
    return await Promise.all(promises);
  },
};

export default actions;
