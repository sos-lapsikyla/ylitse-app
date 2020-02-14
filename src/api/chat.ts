import * as t from 'io-ts';

import * as http from '../lib/http';
import * as result from '../lib/result';

import * as authApi from './auth';
import * as config from './config';
const messageType = t.interface({});
const messageListType = t.strict({ resources: t.array(messageType) });

export async function getMessages(accessToken: authApi.AccessToken) {
  const url = `${config.baseUrl}/${accessToken.userId}/messages`;

  return result.map(
    await http.get(url, messageListType, {
      headers: authApi.authHeader(accessToken),
    }),
    ({ resources }) => resources,
  );
}
