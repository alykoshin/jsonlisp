import { fn_check_params } from "../../lib/util";
import {ActionMethodState, Parameters} from "../../lib/runner";

/*
const ajv = new Ajv()

type ActionArg =       // undefined |
  boolean |
  number |
  bigint |
  string |
  symbol |
  // null |
  Object
;

type ActionList = [
  ActionName,
  ...more: ActionArg[]
]

const schema: JSONSchemaType<ActionList> = {
  type: 'array',
  minItems: 1,
  maxItems: Number.MAX_SAFE_INTEGER,
  items: [
    {
      type: 'string'
    },
  ],
  additionalItems:
    {
      anyOf: [
        {
          type: ['boolean', 'number', /!*'bigint', *!/'string']
        },
        {
          type: ['object'],
          // type: 'object',
          // required: ['label', 'value'],
          properties: {
          }
        },
      ]
    },
};
let validate: ValidateFunction<ActionList>;
*/

export async function parallel(
  action: string,
  parameters: Parameters,
  {id, level, fullConfig, runner, logger}: ActionMethodState
) {
  fn_check_params(parameters, {minCount: 2})
  const promises = parameters.map((a) => runner.eval(a, fullConfig, {level, logger}));
  return await Promise.all(promises);
}

export default parallel;
