import * as future from '../lib/future';

import * as authApi from '../api/auth';
import * as messageApi from '../api/messages';
import * as buddyApi from '../api/buddies';

export type Env = {
  sendMessage: (
    token: authApi.AccessToken,
  ) => (
    params: messageApi.SendMessageParams,
  ) => future.ToResult<ReturnType<typeof messageApi.sendMessage>>;
  fetchBuddies: (
    token: authApi.AccessToken,
  ) => () => future.ToResult<ReturnType<typeof buddyApi.fetchBuddies>>;
};
