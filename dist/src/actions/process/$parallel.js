"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$parallel = void 0;
const util_1 = require("../../lib/util");
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
async function $parallel(action, parameters, state) {
    const { runner, logger } = state;
    (0, util_1.fn_check_params)(parameters, { minCount: 2 });
    const promises = parameters.map((a) => runner.eval(a, state));
    return await Promise.all(promises);
}
exports.$parallel = $parallel;
exports.default = $parallel;
//# sourceMappingURL=$parallel.js.map