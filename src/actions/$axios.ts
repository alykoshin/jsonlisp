/** @format */

import axios from 'axios';
import {ExecutorFn, Actions, ensureString} from './lisp-like/helpers/types';
import {validateArgs} from '../apps/runner/lib/validateArgs';

/**
 * @module $axios
 */

/**
 * @name $axios
 */

export const $axios: ExecutorFn = async function (_, args, {evaluate, logger}) {
  let [method, url, body] = validateArgs(args, {exactCount: [2, 3]});
  ensureString((method = await evaluate(method)));
  ensureString((url = await evaluate(url)));
  if (body) {
    ensureString((body = await evaluate(body)));
    try {
      body = JSON.parse(body);
    } catch (e) {
      throw new Error(
        'Unable to parse body parameter, expecting stringified JSON'
      );
    }
  }
  const config = {
    method,
    url,
    data: body,
  };
  const response = await axios(config);
  const {data, status, statusText} = response;
  logger.debug(`status: ${status} ${statusText}, data.length: ${data.length}`);
  return data;
};

const actions: Actions = {
  $axios,
};

export default actions;
