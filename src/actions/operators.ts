import {fn_check_params} from "../lib/util";
import {ActionMethodState, Parameters} from "../lib/runner";


function calcUnary(op: string, val: any) {
  let result;
  switch (op) {
    case '+':
      result = +val;
      break;
    case '-':
      result = -val;
      break;
    case '*':
      result = val;
      break;
    case '/':
      result = 1 / val;
      break;
    case '=':
    case '/=':
    case '>':
    case '<':
    case '>=':
    case '<=':
    case 'and':
    case 'or':
      result = true;
      break;
    case 'min':
    case 'max':
      result = val;
      break;
    case 'not':
      result = !val;
      break;
    case 'mod':
    case 'rem':
    default:
      throw new Error(`Invalid u-nary operation ${op}`)
  }
  return result;
}

function calcBinary(val1: any, op: string, val2: any): { result: any, last: any, stop: boolean } {
  let result;
  switch (op) {
    case '+':
      result = val1 + val2;
      return {result, last: result, stop: false}
    // break;
    case '-':
      result = val1 - val2;
      return {result, last: result, stop: false}
      break;
    case '*':
      result = val1 * val2;
      return {result, last: result, stop: false}
      break;
    case '/':
      result = val1 / val2;
      return {result, last: result, stop: false}
      break;
    case '=':
      result = val1 === val2;
      return {result, last: val2, stop: !result}
      break;
    case '/=':
      result = val1 !== val2;
      return {result, last: val2, stop: result}
      break;
    case '>':
      result = val1 > val2;
      return {result, last: val2, stop: !result}
      break;
    case '<':
      result = val1 < val2;
      return {result, last: val2, stop: !result}
      break;
    case '>=':
      result = val1 >= val2;
      return {result, last: val2, stop: !result}
      break;
    case '<=':
      result = val1 <= val2;
      return {result, last: val2, stop: !result}
      break;
    case 'min':
      result = val1 > val2 ? val2 : val1;
      return {result, last: result, stop: false}
      break;
    case 'max':
      result = val1 < val2 ? val2 : val1;
      return {result, last: result, stop: false}
      break;
    case 'and':
      result = val1 && val1;
      return {result, last: val2, stop: false}
      break;
    case 'or':
      result = val1 || val1;
      return {result, last: val2, stop: false}
      break;
    case 'mod':
    case 'rem':
      result = val1 % val2;
      return {result, last: result, stop: false}
      break;
    case 'not':
    default:
      throw new Error(`Invalid bi-nary operation ${op}`)
  }
  return result;
}

export async function operators(
  action: string,
  parameters: Parameters,
  {id, level, fullConfig, runner, logger}: ActionMethodState
) {
  fn_check_params(parameters, {minCount: 1})

  const [firstParam, ...restParam] = parameters;
  logger.debug(`operator ${[firstParam, ...restParam].join(String(action))}`)

  const firstValue = await runner.eval(firstParam, fullConfig, {level, logger})

  let res;
  if (parameters.length === 1) {
    res = calcUnary(action, firstValue);
  } else {
    let prevValue = firstValue;
    for (const currParam of restParam) {
      const currValue = await runner.eval(currParam, fullConfig, {level, logger})
      const {result, last, stop} = calcBinary(prevValue, action, currValue);
      res = result;
      if (stop) {
        break;
      }
      prevValue = last;//currValue;
    }
  }
  return res;
}

export default operators;
