"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parallel = void 0;
const util_1 = require("../../lib/util");
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
async function parallel(action, parameters, { id, level, fullConfig, runner, logger }) {
    (0, util_1.fn_check_params)(parameters, { minCount: 2 });
    const promises = parameters.map((a) => runner.eval(a, fullConfig, { level, logger }));
    return await Promise.all(promises);
}
exports.parallel = parallel;
exports.default = parallel;
//# sourceMappingURL=parallel.js.map