import * as future from '../lib/future';

import * as authApi from '../api/auth';
import * as messageApi from '../api/messages';

export type Env = {
  sendMessage: (
    token: authApi.AccessToken,
  ) => (
    params: messageApi.SendMessageParams,
  ) => future.ToResult<ReturnType<typeof messageApi.sendMessage>>;
};
